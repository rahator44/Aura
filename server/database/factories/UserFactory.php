<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->numerify('017########'),
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_active' => true,
            'is_subscribed' => false,
        ];
    }

    public function subscriber()
    {
        return $this->state(['is_subscribed' => true]);
    }

    public function admin()
    {
        return $this->state(['role' => 'admin']);
    }
}
