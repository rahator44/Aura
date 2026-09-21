<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BehaviorAnomalyResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'anomaly',
        'anomaly_score',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
