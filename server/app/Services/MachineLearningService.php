<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\BehaviorAnomalyResult;
use App\Models\UserActivityLog;

class MachineLearningService
{
    public static function evaluateUser($userId)
    {
        try {
            $features = self::extractFeatures($userId);
            
            // Send to FastAPI ML service
            $mlUrl = env('ML_SERVICE_URL', 'http://127.0.0.1:8000');
            $response = Http::timeout(2)->post("{$mlUrl}/predict", $features);
            
            if ($response->successful()) {
                $data = $response->json();
                
                BehaviorAnomalyResult::create([
                    'user_id' => $userId,
                    'anomaly' => $data['prediction'] ?? 'normal',
                    'anomaly_score' => $data['anomaly_score'] ?? 0.0,
                ]);

                if (isset($data['is_anomaly']) && $data['is_anomaly'] === true) {
                    $user = \App\Models\User::find($userId);
                    if ($user && $user->role !== 'admin') {
                        // Immediately block user (Soft Delete) and revoke all active sessions
                        $user->delete();
                        if (method_exists($user, 'tokens')) {
                            $user->tokens()->delete();
                        }
                        
                        Log::warning("ZERO TRUST: User ID {$userId} blocked due to anomalous behavior.");
                        
                        // We could also throw an Exception here to instantly abort the current HTTP request,
                        // but logging them out ensures their very next request will fail authentication.
                    }
                }
            }
        } catch (\Exception $e) {
            // Fails gracefully - log it but don't block user
            Log::error("ML Service Error: " . $e->getMessage());
        }
    }
    
    public static function extractFeatures($userId)
    {
        $logs = UserActivityLog::where('user_id', $userId)->orderBy('created_at', 'asc')->get();
        
        $actionCounts = $logs->groupBy('action')->map->count();
        
        $loginAttempts = clone $logs;
        $loginAttemptsCount = $loginAttempts->whereIn('action', ['LOGIN', 'FAILED_LOGIN'])->count();
        
        $failedLogins = clone $logs;
        $failedLoginsCount = $failedLogins->where('action', 'FAILED_LOGIN')->count();
        
        $pagesAccessed = clone $logs;
        $pagesAccessedCount = $pagesAccessed->count();
        
        $ticketsViewed = clone $logs;
        $ticketsViewedCount = $ticketsViewed->where('action', 'VIEW_TICKET')->count();
        
        $ticketsBooked = clone $logs;
        $ticketsBookedCount = $ticketsBooked->where('action', 'BOOK_TICKET')->count();
        
        $eventsViewed = clone $logs;
        $eventsViewedCount = $eventsViewed->where('action', 'VIEW_EVENT')->count();
        
        $eventsCreated = clone $logs;
        $eventsCreatedCount = $eventsCreated->where('action', 'CREATE_EVENT')->count();
        
        $totalActions = $logs->count();
        
        $sessionDuration = 0;
        if ($logs->count() > 1) {
            $first = $logs->first()->created_at;
            $last = $logs->last()->created_at;
            $sessionDuration = $first->diffInMinutes($last);
        }
        
        $requestsPerMinute = $sessionDuration > 0 ? ($totalActions / $sessionDuration) : $totalActions;
        
        return [
            "login_attempts" => (int) $loginAttemptsCount,
            "failed_logins" => (int) $failedLoginsCount,
            "session_duration" => (float) $sessionDuration,
            "pages_accessed" => (int) $pagesAccessedCount,
            "tickets_viewed" => (int) $ticketsViewedCount,
            "tickets_booked" => (int) $ticketsBookedCount,
            "events_viewed" => (int) $eventsViewedCount,
            "events_created" => (int) $eventsCreatedCount,
            "total_actions" => (int) $totalActions,
            "requests_per_minute" => (float) $requestsPerMinute
        ];
    }
}
