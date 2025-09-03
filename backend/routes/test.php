<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Test endpoint to create an admin user
Route::post('/create-admin', function (Request $request) {
    // Check if admin already exists
    $admin = User::where('user_type', 'admin')->first();
    
    if ($admin) {
        return response()->json([
            'message' => 'Admin user already exists',
            'admin' => $admin
        ]);
    }
    
    // Create admin user
    $admin = User::create([
        'name' => 'System Administrator',
        'first_name' => 'System',
        'last_name' => 'Administrator', 
        'email' => 'admin@lavina-trucking.com',
        'password' => Hash::make('admin123'),
        'user_type' => 'admin',
        'is_active' => true,
    ]);
    
    return response()->json([
        'message' => 'Admin user created successfully',
        'admin' => $admin,
        'login_credentials' => [
            'email' => 'admin@lavina-trucking.com',
            'password' => 'admin123'
        ]
    ], 201);
});
