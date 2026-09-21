<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Notification;
use App\Mail\AdminSubscriptionVerify;
use App\Mail\UserSubscriptionResult;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|string',
            'amount' => 'required|numeric',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'transaction_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $user = $request->user();
            
            // Create Subscription Record as PENDING
            $subscription = Subscription::create([
                'user_id' => $user->id,
                'email' => $request->email,
                'payment_method' => $request->payment_method,
                'amount' => $request->amount,
                'phone' => $request->phone,
                'transaction_id' => $request->transaction_id,
                'status' => 'pending',
            ]);

            // Save updated email on user if requested, but DO NOT activate them yet
            if ($request->has('email')) {
                $user->email = $request->email;
                $user->save();
            }

            // Generate URLs
            $acceptUrl = URL::signedRoute('subscription.verify.accept', ['id' => $subscription->id]);
            $rejectUrl = URL::signedRoute('subscription.verify.reject', ['id' => $subscription->id]);

            // Dispatch Email to Admin
            $adminEmail = env('ADMIN_EMAIL', 'rahator44@gmail.com');
            Mail::to($adminEmail)->send(new AdminSubscriptionVerify($subscription, $user, $acceptUrl, $rejectUrl));

            // Notify Admins
            $admins = \App\Models\User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                if ($user && $admin->id === $user->id) continue;
                \App\Models\Notification::create([
                    'user_id' => $admin->id,
                    'title'   => '🔔 New Subscription Request',
                    'message' => 'A new premium subscription request has been submitted by ' . $user->name,
                    'type'    => 'info',
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Verification submitted! You will receive an email once an admin approves it.',
                'user' => $user
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process subscription: ' . $e->getMessage()
            ], 500);
        }
    }

    public function verifyAccept(Request $request, $id)
    {
        if (! $request->hasValidSignature()) {
            abort(401, 'Invalid or expired link.');
        }

        $subscription = Subscription::findOrFail($id);
        
        if ($subscription->status !== 'pending') {
            return response("This subscription has already been processed as: " . $subscription->status);
        }

        $subscription->status = 'active';
        $subscription->save();

        $user = User::findOrFail($subscription->user_id);
        $user->is_subscribed = true;
        $user->save();

        Notification::create([
            'user_id' => $user->id,
            'title'   => '🎉 Subscription Approved!',
            'message' => 'Congratulations! Your Aura++ Premium subscription has been approved. You now have full access to all premium features.',
            'type'    => 'success',
        ]);

        // Notify user
        Mail::to($user->email)->send(new UserSubscriptionResult($user, true));

        return response("Subscription Accepted! User is now a premium member.");
    }

    public function verifyReject(Request $request, $id)
    {
        if (! $request->hasValidSignature()) {
            abort(401, 'Invalid or expired link.');
        }

        $subscription = Subscription::findOrFail($id);

        if ($subscription->status !== 'pending') {
            return response("This subscription has already been processed as: " . $subscription->status);
        }

        $subscription->status = 'rejected';
        $subscription->save();

        $user = User::findOrFail($subscription->user_id);

        Notification::create([
            'user_id' => $user->id,
            'title'   => '❌ Subscription Rejected',
            'message' => 'Unfortunately, your Aura++ subscription request has been rejected. Please double-check your transaction ID and try again.',
            'type'    => 'danger',
        ]);
        
        // Notify user
        Mail::to($user->email)->send(new UserSubscriptionResult($user, false));

        return response("Subscription Rejected! User has been notified.");
    }

    public function getRecentSubscribers()
    {
        try {
            $count = \App\Models\User::where('is_subscribed', true)->count();

            // Get 3 recent subscribers (name and subscription date)
            $recent = \App\Models\User::where('is_subscribed', true)
                ->orderBy('updated_at', 'desc')
                ->take(3)
                ->get(['name', 'updated_at']);

            return response()->json([
                'success' => true,
                'total_subscribers' => $count,
                'recent_subscribers' => $recent
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch subscriber stats'
            ], 500);
        }
    }
}

