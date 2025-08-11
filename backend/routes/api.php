<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Get all users (for your HomePage display)
Route::get('/users', function () {
    return response()->json(User::all());
});

// Register new user
Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'phone' => 'nullable|string',
        'address' => 'nullable|string',
        'city' => 'nullable|string', 
        'state' => 'nullable|string',
        'zip_code' => 'nullable|string',
        'license_number' => 'nullable|string',
        'license_state' => 'nullable|string',
        'license_expiry' => 'nullable|date',
        'cdl_class' => 'nullable|string',
        'hire_date' => 'nullable|date',
        'user_type' => 'nullable|string',
        'hourly_rate' => 'nullable|numeric',
        'emergency_contact_name' => 'nullable|string',
        'emergency_contact_phone' => 'nullable|string',
        'emergency_contact_relationship' => 'nullable|string',
        'date_of_birth' => 'nullable|date',
        'social_security_number' => 'nullable|string',
        'bank_routing_number' => 'nullable|string',
        'bank_account_number' => 'nullable|string',
    ]);

    $user = User::create([
        'name' => $request->first_name . ' ' . $request->last_name,
        'first_name' => $request->first_name,
        'last_name' => $request->last_name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'phone' => $request->phone,
        'address' => $request->address,
        'city' => $request->city,
        'state' => $request->state,
        'zip_code' => $request->zip_code,
        'license_number' => $request->license_number,
        'license_state' => $request->license_state,
        'license_expiry' => $request->license_expiry,
        'cdl_class' => $request->cdl_class,
        'hire_date' => $request->hire_date,
        'user_type' => $request->user_type ?? 'driver', // Default to 'driver' if not provided
        'hourly_rate' => $request->hourly_rate,
        'emergency_contact_name' => $request->emergency_contact_name,
        'emergency_contact_phone' => $request->emergency_contact_phone,
        'emergency_contact_relationship' => $request->emergency_contact_relationship,
        'date_of_birth' => $request->date_of_birth,
        'social_security_number' => $request->social_security_number,
        'bank_routing_number' => $request->bank_routing_number,
        'bank_account_number' => $request->bank_account_number,
        'is_active' => true, // Set as active by default
    ]);

    // Create a simple token (in production, use Laravel Sanctum)
    $token = base64_encode($user->id . '|' . $user->email . '|' . now()->timestamp);

    return response()->json([
        'message' => 'User created successfully',
        'user' => $user,
        'token' => $token
    ], 201);
});

// Login user
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    // Create a simple token (in production, use Laravel Sanctum)
    $token = base64_encode($user->id . '|' . $user->email . '|' . now()->timestamp);

    return response()->json([
        'message' => 'Login successful',
        'user' => $user,
        'token' => $token
    ]);
});

