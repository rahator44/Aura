<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition()
    {
        $categories = ['Concert', 'Tech', 'Comic', 'Entertainment', 'Sports', 'Cultural', 'Business'];
        $locations = [
            ['location' => 'ICCB Arena', 'city_country' => 'Dhaka, Bangladesh'],
            ['location' => 'Army Stadium', 'city_country' => 'Dhaka, Bangladesh'],
            ['location' => 'Bashundhara Convention City', 'city_country' => 'Dhaka, Bangladesh'],
            ['location' => 'International Convention City Bashundhara', 'city_country' => 'Dhaka, Bangladesh'],
            ['location' => 'Radisson Blu Dhaka', 'city_country' => 'Dhaka, Bangladesh'],
            ['location' => 'National Museum Auditorium', 'city_country' => 'Dhaka, Bangladesh'],
        ];
        $venue = $this->faker->randomElement($locations);
        $guestNames = ['Linus Torvalds', 'Dan Abramov', 'A.R. Rahman', 'Kevin Hart', 'Vitalik Buterin', 'Zakir Hussain'];
        $images = [
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1470229722913-7c090be5bc65?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1459749411177-042180ce672c?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop',
        ];

        $capacity = $this->faker->numberBetween(200, 5000);
        $ticketsSold = $this->faker->numberBetween(0, $capacity);

        return [
            'title' => $this->faker->bs() . ' ' . $this->faker->randomElement(['Festival', 'Summit', 'Night', 'Concert', 'Expo', 'Conference', 'Bash']),
            'description' => $this->faker->paragraph(3),
            'date' => $this->faker->dateTimeBetween('now', '+3 months'),
            'location' => $venue['location'],
            'city_country' => $venue['city_country'],
            'image' => $this->faker->randomElement($images),
            'price' => $this->faker->randomElement([300, 500, 800, 1000, 1200, 1500, 2000, 2500]),
            'capacity' => $capacity,
            'tickets_sold' => $ticketsSold,
            'category' => $this->faker->randomElement($categories),
            'is_featured' => $this->faker->boolean(30),
            'chief_guest' => $this->faker->randomElement($guestNames),
            'user_id' => null,
        ];
    }
}
