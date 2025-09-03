<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@lavina.com',
            'password' => bcrypt('admin123'),
            'user_type' => 'admin',
            'is_active' => true,
        ]);

        // Create test driver (this will be blocked for testing)
        User::factory()->create([
            'name' => 'Test Driver',
            'email' => 'driver@lavina.com',
            'password' => bcrypt('driver123'),
            'user_type' => 'driver',
            'is_active' => true,
        ]);
    }
}
