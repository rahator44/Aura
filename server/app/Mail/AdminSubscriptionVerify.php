<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Subscription;
use App\Models\User;

class AdminSubscriptionVerify extends Mailable
{
    use Queueable, SerializesModels;

    public $subscription;
    public $user;
    public $acceptUrl;
    public $rejectUrl;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Subscription $subscription, User $user, $acceptUrl, $rejectUrl)
    {
        $this->subscription = $subscription;
        $this->user = $user;
        $this->acceptUrl = $acceptUrl;
        $this->rejectUrl = $rejectUrl;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from($this->subscription->email, $this->user->name)
                    ->replyTo($this->subscription->email, $this->user->name)
                    ->subject('New Subscription Verification Request')
                    ->view('emails.admin_verify');
    }
}
