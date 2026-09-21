<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckSubscriber
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && ($request->user()->is_subscribed || $request->user()->role === 'admin')) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Subscription required to perform this action.'
        ], 403);
    }
}
