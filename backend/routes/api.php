<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Test endpoint to create an admin user for testing
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
        'user_type' => 'nullable|in:admin,driver,client',
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
        'user_type' => $request->user_type ?? 'client', // Default to 'client' if not provided
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

    // Check if user is active/not blocked
    if (!$user->is_active) {
        throw ValidationException::withMessages([
            'email' => ['Your account has been blocked. Please contact an administrator.'],
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

// Profile management routes (require authentication)
use App\Http\Controllers\API\ProfileController;

// Simple test endpoint for debugging
Route::post('/test-update', function (Request $request) {
    \Log::info('Test update endpoint hit:', $request->all());
    
    $user = User::find(1);
    if ($user) {
        $user->update(['first_name' => 'Test', 'last_name' => 'Updated']);
        return response()->json(['success' => true, 'message' => 'Test update successful', 'user' => $user]);
    }
    
    return response()->json(['success' => false, 'message' => 'User not found']);
});

// Simple authentication middleware for demo
Route::middleware(['api'])->group(function () {
    // For demo purposes, we'll make these routes accessible without strict auth
    // In production, you should use Laravel Sanctum or Passport
    Route::get('/profile/{id?}', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/picture', [ProfileController::class, 'uploadProfilePicture']);
});

// User Management Routes (Admin only)
// Simple middleware check for admin users
Route::middleware(['api'])->group(function () {
    // Get all users (with filtering)
    Route::get('/admin/users', function (Request $request) {
        // In production, add proper admin authentication check
        $query = User::query();
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }
        
        if ($request->has('user_type')) {
            $query->where('user_type', $request->user_type);
        }
        
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }
        
        $users = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    });
    
    // Create new user
    Route::post('/admin/users', function (Request $request) {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'user_type' => 'required|in:admin,driver,client',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'zip_code' => 'nullable|string',
            'hourly_rate' => 'nullable|numeric',
        ]);
        
        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => $request->user_type,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'zip_code' => $request->zip_code,
            'hourly_rate' => $request->hourly_rate,
            'is_active' => true,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $user
        ], 201);
    });
    
    // Update user
    Route::put('/admin/users/{id}', function (Request $request, $id) {
        $user = User::findOrFail($id);
        
        $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|nullable|string|min:8',
            'user_type' => 'sometimes|required|in:admin,driver,client',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'zip_code' => 'nullable|string',
            'hourly_rate' => 'nullable|numeric',
        ]);
        
        $updateData = $request->except(['password']);
        
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }
        
        if ($request->has('first_name') || $request->has('last_name')) {
            $updateData['name'] = ($request->first_name ?? $user->first_name) . ' ' . ($request->last_name ?? $user->last_name);
        }
        
        $user->update($updateData);
        
        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user->fresh()
        ]);
    });
    
    // Toggle user active status (block/unblock)
    Route::patch('/admin/users/{id}/toggle-status', function ($id) {
        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);
        
        return response()->json([
            'success' => true,
            'message' => $user->is_active ? 'User activated successfully' : 'User blocked successfully',
            'data' => $user
        ]);
    });
    
    // Delete user (soft delete or permanent delete)
    Route::delete('/admin/users/{id}', function ($id) {
        $user = User::findOrFail($id);
        $user->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    });
});

