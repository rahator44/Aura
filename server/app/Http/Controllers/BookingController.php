<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Event;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use App\Mail\AdminBookingVerify;
use App\Mail\UserBookingResult;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'event_id' => 'required|exists:events,id',
            'quantity' => 'required|integer|min:1',
            'phone' => 'nullable|string|max:20',
            'payment_method' => 'nullable|string',
            'transaction_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $event = Event::findOrFail($request->event_id);

        // Check capacity
        $bookedCount = Booking::where('event_id', $event->id)->sum('quantity');
        if ($bookedCount + $request->quantity > $event->capacity) {
            return response()->json([
                'success' => false,
                'message' => 'Not enough tickets available. Only ' . ($event->capacity - $bookedCount) . ' left.'
            ], 400);
        }

        // Membership Discount Logic
        $user = Auth::user();
        $bookingCount = $user->bookings()->where('status', 'confirmed')->count();
        $isMembershipMember = $bookingCount >= 2;
        $discount = $isMembershipMember ? 0.1 : 0;
        
        $total_price = ($event->price * $request->quantity) * (1 - $discount);

        $booking = Booking::create([
            'user_id' => Auth::id(),
            'event_id' => $event->id,
            'quantity' => $request->quantity,
            'total_price' => $total_price,
            'phone' => $request->phone ?? 'N/A',
            'transaction_id' => $request->transaction_id,
            'payment_method' => $request->payment_method ?? 'bkash',
            'status' => 'pending',
        ]);
        
        \App\Services\ActivityLogger::log(Auth::id(), 'BOOK_TICKET');

        // Generate Signed Verification URLs
        $acceptUrl = URL::signedRoute('booking.verify.accept', ['id' => $booking->id]);
        $rejectUrl = URL::signedRoute('booking.verify.reject', ['id' => $booking->id]);

        // Dispatch Email to Admin
        $adminEmail = env('ADMIN_EMAIL', 'rahator44@gmail.com');
        Mail::to($adminEmail)->send(new AdminBookingVerify($booking, $user, $acceptUrl, $rejectUrl));

        // Notify Admins
        $admins = \App\Models\User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            if ($user && $admin->id === $user->id) continue;
            \App\Models\Notification::create([
                'user_id' => $admin->id,
                'title'   => '🔔 New Booking Request',
                'message' => 'A new booking request has been submitted by ' . $user->name . ' for ' . $request->quantity . ' tickets.',
                'type'    => 'info',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Booking request submitted! Your tickets will be confirmed once an admin verifies the transaction.',
            'booking' => $booking
        ], 201);
    }

    public function index()
    {
        $bookings = Auth::user()->bookings()->with('event')->latest()->paginate(5);
        return response()->json(['success' => true, 'bookings' => $bookings]);
    }

    public function getCreatorStats()
    {
        $userId = Auth::id();
        $ticketsSold = Booking::whereHas('event', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->where('status', 'confirmed')
        ->sum('quantity');

        return response()->json([
            'success' => true,
            'tickets_sold' => (int) $ticketsSold
        ]);
    }

    public function getAllBookings()
    {
        $bookings = Booking::with(['user', 'event'])->latest()->get();
        return response()->json(['success' => true, 'bookings' => $bookings]);
    }

    public function acceptBooking($id)
    {
        $booking = Booking::with(['user', 'event'])->findOrFail($id);
        
        if ($booking->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'This booking has already been processed.'], 400);
        }

        $booking->status = 'confirmed';
        $booking->save();

        // Notify User
        $user = $booking->user;

        Notification::create([
            'user_id' => $user->id,
            'title'   => '🎫 Booking Confirmed',
            'message' => 'Your booking has been confirmed',
            'type'    => 'success',
        ]);

        Mail::to($user->email)->send(new UserBookingResult($user, $booking, true));

        return response()->json(['success' => true, 'message' => 'Booking accepted successfully!']);
    }

    public function rejectBooking($id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'This booking has already been processed.'], 400);
        }

        $booking->status = 'rejected';
        $booking->save();

        // Notify User
        $user = $booking->user;

        Notification::create([
            'user_id' => $user->id,
            'title'   => '❌ Booking Rejected',
            'message' => 'Unfortunately, your booking request was rejected for the event: ' . $booking->event->title,
            'type'    => 'danger',
        ]);

        Mail::to($user->email)->send(new UserBookingResult($user, $booking, false));

        return response()->json(['success' => true, 'message' => 'Booking rejected successfully.']);
    }

    public function verifyAccept(Request $request, $id)
    {
        if (! $request->hasValidSignature()) {
            abort(401, 'Invalid or expired link.');
        }

        $booking = Booking::with(['user', 'event'])->findOrFail($id);
        
        if ($booking->status !== 'pending') {
            return response("This booking has already been processed as: " . $booking->status);
        }

        $booking->status = 'confirmed';
        $booking->save();

        // Notify User
        $user = $booking->user;

        Notification::create([
            'user_id' => $user->id,
            'title'   => '🎫 Booking Confirmed',
            'message' => 'Your booking has been confirmed',
            'type'    => 'success',
        ]);

        Mail::to($user->email)->send(new UserBookingResult($user, $booking, true));

        return response("Booking Confirmed! The user's ticket is now active.");
    }

    public function verifyReject(Request $request, $id)
    {
        if (! $request->hasValidSignature()) {
            abort(401, 'Invalid or expired link.');
        }

        $booking = Booking::findOrFail($id);

        if ($booking->status !== 'pending') {
            return response("This booking has already been processed as: " . $booking->status);
        }

        $booking->status = 'rejected';
        $booking->save();

        // Notify User
        $user = Auth::guard('api')->user() ?: User::find($booking->user_id);

        Notification::create([
            'user_id' => $user->id,
            'title'   => '❌ Booking Rejected',
            'message' => 'Unfortunately, your booking request was rejected for the event: ' . $booking->event->title,
            'type'    => 'danger',
        ]);

        Mail::to($user->email)->send(new UserBookingResult($user, $booking, false));

        return response("Booking Rejected! The transaction has been declined.");
    }
}
