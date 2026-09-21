<!DOCTYPE html>
<html>
<head>
    <title>Subscription Verification Request</title>
</head>
<body style="font-family: sans-serif; padding: 20px;">
    <h2>New Subscription Verification Request</h2>
    
    <p>A user has requested to become a premium subscriber on Aura++.</p>
    
    <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Name:</strong> {{ $user->name }}</p>
        <p><strong>Email:</strong> {{ $subscription->email }}</p>
        <p><strong>Transaction ID:</strong> {{ $subscription->transaction_id }}</p>
        <p><strong>Amount:</strong> {{ $subscription->amount }} BDT</p>
        <p><strong>Method:</strong> {{ $subscription->payment_method }}</p>
    </div>

    <p>Please review the transaction ID. If it is valid, accept the request below.</p>

    <div style="margin-top: 30px;">
        <a href="{{ $acceptUrl }}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px; font-weight: bold;">Accept Subscription</a>
        
        <a href="{{ $rejectUrl }}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reject</a>
    </div>
</body>
</html>
