<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use Illuminate\Support\Facades\Hash;
use Database\Factories\UserFactory;
use Database\Factories\EventFactory;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create a fixed admin account for your login
        $admin = User::create([
            'name'     => 'Admin Rifat',
            'email'    => 'rahator44@gmail.com',
            'phone'    => '01712345678',
            'password' => Hash::make('password'),
            'role'     => 'admin',
            'is_active' => true,
        ]);

        // Create 5 random subscriber users using factory
        User::factory()->count(5)->subscriber()->create();

        // Create 5 random regular users
        User::factory()->count(5)->create();

        // Create 20 random events owned by the admin (dynamic - no hardcoding)
        Event::factory()->count(20)->create(['user_id' => $admin->id]);

        // Create 5 featured events
        Event::factory()->count(5)->create([
            'user_id'     => $admin->id,
            'is_featured' => true,
        ]);
    }
}
