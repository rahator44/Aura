<?php

namespace App\Http\Controllers;

use App\Models\BehaviorAnomalyResult;
use Illuminate\Http\Request;

class AnomalyController extends Controller
{
    public function index()
    {
        $anomalies = BehaviorAnomalyResult::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();
            
        return response()->json([
            'success' => true,
            'anomalies' => $anomalies
        ]);
    }
}
