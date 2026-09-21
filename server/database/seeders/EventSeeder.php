<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = \Carbon\Carbon::parse('2026-02-28 21:50:00'); // Use a fixed baseline close to current time

        $events = [
            [
                'title' => 'Red Carpet Countdown 2025',
                'description' => 'Experience the most glamorous New Year\'s Eve countdown in Dhaka.',
                'date' => $now->copy()->subMinutes(30)->toDateTimeString(), // Live Now!
                'location' => 'Grand Ball Room, Radisson Blu Dhaka Water Garden',
                'city_country' => 'Dhaka, Bangladesh',
                'image' => 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop',
                'price' => 300,
                'capacity' => 500,
            ],
            [
                'title' => 'Electric Dreams Festival',
                'description' => 'A night of electronic beats and mesmerizing light shows.',
                'date' => $now->copy()->addHours(2)->toDateTimeString(), // Starting soon
                'location' => 'City Convention Center',
                'city_country' => 'Mumbai, India',
                'image' => 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
                'price' => 250,
                'capacity' => 1000,
            ],
            [
                'title' => 'Summer Vibes Concert',
                'description' => 'Enjoy the best of summer music under the stars.',
                'date' => $now->copy()->addDays(2)->toDateTimeString(),
                'location' => 'Open Air Stadium',
                'city_country' => 'Dubai, UAE',
                'image' => 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop',
                'price' => 350,
                'capacity' => 2000,
            ],
            [
                'title' => 'Jazz Night Live',
                'description' => 'An intimate evening with world-class jazz musicians.',
                'date' => $now->copy()->addDays(5)->toDateTimeString(),
                'location' => 'Cultural Complex Auditorium',
                'city_country' => 'Singapore',
                'image' => 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop',
                'price' => 200,
                'capacity' => 300,
            ],
            [
                'title' => 'Rock Revolution',
                'description' => 'Get ready to rock with the legends of alternative and hard rock.',
                'date' => $now->copy()->addDays(10)->toDateTimeString(),
                'location' => 'National Stadium',
                'city_country' => 'Bangkok, Thailand',
                'image' => 'https://images.unsplash.com/photo-1459749411177-042180ce672c?q=80&w=1000&auto=format&fit=crop',
                'price' => 400,
                'capacity' => 5000,
            ],
            [
                'title' => 'Electronic Pulse',
                'description' => 'The ultimate EDM experience with top-tier DJs.',
                'date' => $now->copy()->addDays(15)->toDateTimeString(),
                'location' => 'Tech Arena',
                'city_country' => 'Seoul, South Korea',
                'image' => 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop',
                'price' => 280,
                'capacity' => 1500,
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
