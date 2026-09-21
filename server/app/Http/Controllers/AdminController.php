<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\Booking;
use App\Models\Subscription;
use App\Models\Notification;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserSubscriptionResult;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get platform statistics.
     */
    public function getStats()
    {
        return response()->json([
            'stats' => [
                'total_users' => User::count(),
                'total_events' => Event::count(),
                'total_bookings' => Booking::count(),
                'total_revenue' => Booking::where('status', 'confirmed')->sum('total_price'),
            ]
        ]);
    }

    /**
     * Get all users.
     */
    public function getUsers()
    {
        $users = User::withTrashed()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * Toggle user active status.
     */
    public function toggleUserStatus(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);

        $status = $user->is_active ? 'activated' : 'suspended';
        return response()->json([
            'message' => "User status $status successfully",
            'user' => $user
        ]);
    }

    /**
     * Delete a user (Soft Delete).
     */
    public function deleteUser(User $user)
    {
        if ($user->trashed()) {
            return response()->json([
                'message' => 'User is already in suspension'
            ]);
        }

        $user->delete();

        return response()->json([
            'message' => 'User suspended successfully'
        ]);
    }

    /**
     * Get all subscriptions
     */
    public function getSubscriptions()
    {
        $subscriptions = Subscription::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'subscriptions' => $subscriptions
        ]);
    }

    /**
     * Accept a subscription manually via Dashboard.
     */
    public function acceptSubscription($id)
    {
        $subscription = Subscription::with('user')->findOrFail($id);

        if ($subscription->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Subscription is no longer pending.'], 400);
        }

        $subscription->update(['status' => 'active']);
        
        $user = clone $subscription->user;
        $subscription->user()->update(['is_subscribed' => true]);

        // Create in-app notification for the user
        Notification::create([
            'user_id' => $subscription->user_id,
            'title'   => '🎉 Subscription Approved!',
            'message' => 'Congratulations! Your Aura++ Premium subscription has been approved. You now have full access to all premium features.',
            'type'    => 'success',
        ]);

        try {
            Mail::to($user->email)->send(new UserSubscriptionResult($user, true));
        } catch (\Exception $e) {
            \Log::error('Mail sending failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Subscription accepted successfully.'
        ]);
    }

    /**
     * Reject a subscription manually via Dashboard.
     */
    public function rejectSubscription($id)
    {
        $subscription = Subscription::with('user')->findOrFail($id);

        if ($subscription->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Subscription is no longer pending.'], 400);
        }

        $subscription->update(['status' => 'rejected']);
        $user = clone $subscription->user;

        // Create in-app notification for the user
        Notification::create([
            'user_id' => $subscription->user_id,
            'title'   => '❌ Subscription Rejected',
            'message' => 'Unfortunately, your Aura++ subscription request has been rejected. Please double-check your transaction ID and try again.',
            'type'    => 'danger',
        ]);

        try {
            Mail::to($user->email)->send(new UserSubscriptionResult($user, false));
        } catch (\Exception $e) {
            \Log::error('Mail sending failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Subscription rejected successfully.'
        ]);
    }
}
