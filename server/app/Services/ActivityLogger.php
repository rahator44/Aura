<?php

namespace App\Services;

use App\Models\UserActivityLog;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    public static function log($userId, $action)
    {
        if (!$userId) return;
        
        UserActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
        
        // Zero Trust trigger - evaluate behavior dynamically upon sensitive actions
        if (in_array($action, ['LOGIN', 'BOOK_TICKET', 'CREATE_EVENT'])) {
            MachineLearningService::evaluateUser($userId);
        }
    }
}
