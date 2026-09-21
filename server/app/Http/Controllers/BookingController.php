<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
            'status' => 'confirmed',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking confirmed! Your tickets are ready.',
            'booking' => $booking
        ], 201);
    }

    public function index()
    {
        $bookings = Auth::user()->bookings()->with('event')->latest()->paginate(5);
        return response()->json(['success' => true, 'bookings' => $bookings]);
    }

    public function getAllBookings()
    {
        $bookings = Booking::with(['user', 'event'])->latest()->get();
        return response()->json(['success' => true, 'bookings' => $bookings]);
    }
}
