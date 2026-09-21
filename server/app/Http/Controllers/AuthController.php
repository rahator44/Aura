<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Check if a trashed user exists with this email FIRST
        if (User::onlyTrashed()->where('email', $request->email)->exists()) {
            return response()->json(['message' => 'You have violated community rules'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        $role = ($request->email === 'rahator44@gmail.com') ? 'admin' : 'user';

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $role,
        ]);

        /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $guard */
        $guard = auth('api');
        $token = $guard->login($user);

        return $this->respondWithToken($token, $user, 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        // Check if the user is soft-deleted (banned)
        if (User::onlyTrashed()->where('email', $request->email)->exists()) {
            return response()->json(['message' => 'You have violated community rules'], 403);
        }

        if (! $token = auth('api')->attempt($credentials)) {
            $failedUser = User::where('email', $request->email)->first();
            if ($failedUser) {
                \App\Services\ActivityLogger::log($failedUser->id, 'FAILED_LOGIN');
            }
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = auth('api')->user();

        // Force admin role if email matches
        if ($user->email === 'rahator44@gmail.com' && $user->role !== 'admin') {
            $user->update(['role' => 'admin']);
        }

        $user->update(['last_login_at' => now()]);
        \App\Services\ActivityLogger::log($user->id, 'LOGIN');

        return $this->respondWithToken($token, $user);
    }

    public function logout()
    {
        if (auth('api')->check()) {
            \App\Services\ActivityLogger::log(auth('api')->id(), 'LOGOUT');
        }
        auth('api')->logout();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function socialLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'provider_id' => 'required|string',
            'provider' => 'nullable|string',
        ]);

        $user = User::withTrashed()->where('email', $request->email)->first();

        if ($user && $user->trashed()) {
            return response()->json(['message' => 'You have violated community rules'], 403);
        }

        $isNewUser = false;

        // Logic to decide role based on email - The SQL Source of Truth
        $role = ($request->email === 'rahator44@gmail.com') ? 'admin' : 'user';

        if (! $user) {
            // New user registration via Social
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $role,
                'password' => Hash::make(Str::random(16)),
                'provider' => $request->provider ?? 'google',
                'provider_id' => $request->provider_id,
                'phone' => null,
            ]);
            $isNewUser = true;
        } else {
            // Existing user - update role and link provider if needed
            $user->update([
                'role' => $role, // Ensure role is correct even for returning users
                'provider' => $request->provider ?? 'google',
                'provider_id' => $request->provider_id,
            ]);
        }

        /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $guard */
        $guard = auth('api');
        $token = $guard->login($user);

        $user->update(['last_login_at' => now()]);

        return $this->respondWithToken($token, $user, 200, [
            'is_new_user' => $isNewUser,
            'message' => $isNewUser ? 'Account created successfully!' : 'Welcome back!'
        ]);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     * @param  User $user
     * @param  int $status
     * @param  array $additional
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token, $user, $status = 200, $additional = [])
    {
        /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $guard */
        $guard = auth('api');
        return response()->json(array_merge([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $guard->factory()->getTTL() * 60,
            'user' => $user,
        ], $additional), $status);
    }
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::withTrashed()->where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'If this email exists, a reset code has been sent.'], 200);
        }

        if ($user->trashed()) {
            return response()->json(['message' => 'You have violated community rules'], 403);
        }

        // Generate a 6-digit code for simulation
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store or update the token
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $code,
                'created_at' => now(),
            ]
        );

        // In a real app, you would send an email here.
        // For simulation, we return the code in the response so the user can see it.
        return response()->json([
            'message' => 'Reset code sent successfully!',
            'simulated_code' => $code // DO NOT do this in production!
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $reset = \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->first();

        if (!$reset || now()->subMinutes(60)->gt($reset->created_at)) {
            return response()->json(['message' => 'Invalid or expired reset code.'], 422);
        }

        $user = User::where('email', $request->email)->first();
        if ($user) {
            $user->update(['password' => Hash::make($request->password)]);

            // Delete the token after use
            \Illuminate\Support\Facades\DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json(['message' => 'Password reset successful!']);
        }

        return response()->json(['message' => 'User not found.'], 404);
    }
}
