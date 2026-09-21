<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'email',
        'payment_method',
        'amount',
        'phone',
        'transaction_id',
        'card_number',
        'expiry',
        'cvv',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
