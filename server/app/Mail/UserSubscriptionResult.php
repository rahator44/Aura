<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UserSubscriptionResult extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $isAccepted;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user, $isAccepted)
    {
        $this->user = $user;
        $this->isAccepted = $isAccepted;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = $this->isAccepted ? 'Aura++ Subscription Approved!' : 'Aura++ Subscription Update';
        return $this->subject($subject)
            ->view('emails.user_result');
    }
}
