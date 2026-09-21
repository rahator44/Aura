<!DOCTYPE html>
<html>
<head>
    <title>Subscription Update</title>
</head>
<body style="font-family: sans-serif; padding: 20px;">
    <h2>Hello, {{ $user->name }}</h2>
    
    @if($isAccepted)
        <p style="color: #28a745; font-size: 18px; font-weight: bold;">
            Congratulations! Your Aura++ subscription has been verified and approved.
        </p>
        <p>You can now log in and enjoy all the premium features, instant bookings, and event discounts.</p>
        
        <a href="{{ env('FRONTEND_URL', 'http://localhost:5174') }}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 15px;">Go to Aura++</a>
    @else
        <p style="color: #dc3545; font-size: 18px; font-weight: bold;">
            Unfortunately, your subscription request could not be verified.
        </p>
        <p>This is usually due to an incorrect transaction ID or validation failure. Please try again with the correct transaction details.</p>
    @endif
    
    <p style="margin-top: 30px; font-size: 12px; color: #888;">
        Best regards,<br>
        The Aura++ Team
    </p>
</body>
</html>
