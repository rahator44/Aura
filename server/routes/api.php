<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Auth Routes (Throttled to 5 attempts per minute)
Route::middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/social-login', [AuthController::class, 'socialLogin']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

// Admin Dashboard Routes
Route::middleware(['auth:api', 'check.admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [\App\Http\Controllers\AdminController::class, 'getStats']);
    Route::get('/users', [\App\Http\Controllers\AdminController::class, 'getUsers']);
    Route::post('/users/{user}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleUserStatus'])->withTrashed();
    Route::delete('/users/{user}', [\App\Http\Controllers\AdminController::class, 'deleteUser'])->withTrashed();
    Route::get('/bookings', [\App\Http\Controllers\BookingController::class, 'getAllBookings']);
    Route::post('/bookings/{id}/accept', [\App\Http\Controllers\BookingController::class, 'acceptBooking']);
    Route::post('/bookings/{id}/reject', [\App\Http\Controllers\BookingController::class, 'rejectBooking']);
    Route::get('/subscriptions', [\App\Http\Controllers\AdminController::class, 'getSubscriptions']);
    Route::post('/subscriptions/{id}/accept', [\App\Http\Controllers\AdminController::class, 'acceptSubscription']);
    Route::post('/subscriptions/{id}/reject', [\App\Http\Controllers\AdminController::class, 'rejectSubscription']);
    Route::get('/anomalies', [\App\Http\Controllers\AnomalyController::class, 'index']);
});

// Subscriber Event Management
Route::middleware(['auth:api', 'check.subscriber'])->group(function () {
    Route::post('/events', [\App\Http\Controllers\EventController::class, 'store']);
    Route::put('/events/{event}', [\App\Http\Controllers\EventController::class, 'update']);
    Route::delete('/events/{event}', [\App\Http\Controllers\EventController::class, 'destroy']);
});

// Public Event Routes
Route::get('/events/categories', [\App\Http\Controllers\EventController::class, 'getCategories']);
Route::get('/events', [\App\Http\Controllers\EventController::class, 'index']);
Route::get('/events/{event}', [\App\Http\Controllers\EventController::class, 'show']);

// Public Subscription Stats Route
Route::get('/subscribers/recent', [\App\Http\Controllers\SubscriptionController::class, 'getRecentSubscribers']);

// User Booking Routes
Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::post('/subscribe', [\App\Http\Controllers\SubscriptionController::class, 'subscribe']);
    Route::post('/bookings', [\App\Http\Controllers\BookingController::class , 'store']);
    Route::get('/my-bookings', [\App\Http\Controllers\BookingController::class , 'index']);
    Route::get('/creator-stats', [\App\Http\Controllers\BookingController::class, 'getCreatorStats']);
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class , 'index']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class , 'markRead']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class , 'markAllRead']);
});

// Admin Subscription Verification (Signed URLs, clicked from email)
Route::get('/subscriptions/verify/{id}/accept', [\App\Http\Controllers\SubscriptionController::class, 'verifyAccept'])
    ->name('subscription.verify.accept');
Route::get('/subscriptions/verify/{id}/reject', [\App\Http\Controllers\SubscriptionController::class, 'verifyReject'])
    ->name('subscription.verify.reject');

// Admin Booking Verification (Signed URLs, clicked from email)
Route::get('/bookings/verify/{id}/accept', [\App\Http\Controllers\BookingController::class, 'verifyAccept'])
    ->name('booking.verify.accept');
Route::get('/bookings/verify/{id}/reject', [\App\Http\Controllers\BookingController::class, 'verifyReject'])
    ->name('booking.verify.reject');
