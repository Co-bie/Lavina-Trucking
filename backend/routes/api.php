<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Truck;
use App\Models\Trip;
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

// Get all drivers
Route::get('/drivers', function () {
    $drivers = User::where('user_type', 'driver')->get();
    return response()->json([
        'success' => true,
        'data' => $drivers
    ]);
});

// Get single driver profile
Route::get('/drivers/{id}', function ($id) {
    $driver = User::where('id', $id)->where('user_type', 'driver')->first();
    
    if (!$driver) {
        return response()->json([
            'success' => false,
            'message' => 'Driver not found'
        ], 404);
    }
    
    return response()->json([
        'success' => true,
        'data' => $driver
    ]);
});

// Update driver profile
Route::put('/drivers/{id}', function (Request $request, $id) {
    $driver = User::where('id', $id)->where('user_type', 'driver')->first();
    
    if (!$driver) {
        return response()->json([
            'success' => false,
            'message' => 'Driver not found'
        ], 404);
    }
    
    // Validate the request
    $request->validate([
        'first_name' => 'sometimes|string|max:255',
        'last_name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $id,
        'phone' => 'sometimes|string|max:20',
        'contact_number' => 'sometimes|string|max:20',
        'address' => 'sometimes|string|max:500',
        'city' => 'sometimes|string|max:100',
        'state' => 'sometimes|string|max:100',
        'zip_code' => 'sometimes|string|max:20',
        'age' => 'sometimes|integer|min:16|max:100',
        'license_number' => 'sometimes|string|max:50',
        'license_class' => 'sometimes|string|max:10',
        'license_expiry' => 'sometimes|date',
        'endorsements' => 'sometimes|string|max:255',
        'hire_date' => 'sometimes|date',
        'employment_status' => 'sometimes|in:active,inactive,terminated',
        'hourly_rate' => 'sometimes|numeric|min:0',
        'emergency_contact_name' => 'sometimes|string|max:255',
        'emergency_contact_phone' => 'sometimes|string|max:20',
        'emergency_contact_relationship' => 'sometimes|string|max:100',
        'date_of_birth' => 'sometimes|date',
        'notes' => 'sometimes|string|max:1000',
    ]);
    
    // Update the driver
    $updateData = $request->only([
        'first_name', 'last_name', 'email', 'phone', 'contact_number', 'address',
        'city', 'state', 'zip_code', 'age', 'license_number', 'license_class',
        'license_expiry', 'endorsements', 'hire_date', 'employment_status',
        'hourly_rate', 'emergency_contact_name', 'emergency_contact_phone',
        'emergency_contact_relationship', 'date_of_birth', 'notes'
    ]);
    
    // Update the name field if first_name or last_name changed
    if (isset($updateData['first_name']) || isset($updateData['last_name'])) {
        $firstName = $updateData['first_name'] ?? $driver->first_name;
        $lastName = $updateData['last_name'] ?? $driver->last_name;
        $updateData['name'] = $firstName . ' ' . $lastName;
    }
    
    $driver->update($updateData);
    
    return response()->json([
        'success' => true,
        'message' => 'Driver profile updated successfully',
        'data' => $driver->fresh()
    ]);
});

// Create test drivers endpoint
Route::post('/create-test-drivers', function () {
    $drivers = [
        [
            'name' => 'John Doe',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.driver@lavina.com',
            'password' => Hash::make('password123'),
            'user_type' => 'driver',
            'phone' => '+1 555-0123',
            'address' => '123 Main St',
            'city' => 'Manila',
            'state' => 'Metro Manila',
            'age' => 35,
            'license_number' => 'DL123456789',
            'license_class' => 'Class A',
            'license_expiry' => '2026-12-31',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '+1 555-0124',
            'emergency_contact_relationship' => 'Wife',
            'is_active' => true,
        ],
        [
            'name' => 'Mike Johnson',
            'first_name' => 'Mike',
            'last_name' => 'Johnson',
            'email' => 'mike.driver@lavina.com',
            'password' => Hash::make('password123'),
            'user_type' => 'driver',
            'phone' => '+1 555-0125',
            'address' => '456 Oak Ave',
            'city' => 'Quezon City',
            'state' => 'Metro Manila',
            'age' => 42,
            'license_number' => 'DL987654321',
            'license_class' => 'Class B',
            'license_expiry' => '2027-06-15',
            'emergency_contact_name' => 'Sarah Johnson',
            'emergency_contact_phone' => '+1 555-0126',
            'emergency_contact_relationship' => 'Sister',
            'is_active' => true,
        ],
        [
            'name' => 'Carlos Santos',
            'first_name' => 'Carlos',
            'last_name' => 'Santos',
            'email' => 'carlos.driver@lavina.com',
            'password' => Hash::make('password123'),
            'user_type' => 'driver',
            'phone' => '+63 917 555 0127',
            'address' => '789 Pine Rd',
            'city' => 'Makati',
            'state' => 'Metro Manila',
            'age' => 28,
            'license_number' => 'DL456789123',
            'license_class' => 'Class A',
            'license_expiry' => '2025-03-20',
            'emergency_contact_name' => 'Maria Santos',
            'emergency_contact_phone' => '+63 917 555 0128',
            'emergency_contact_relationship' => 'Mother',
            'is_active' => false,
        ]
    ];

    $createdDrivers = [];
    foreach ($drivers as $driverData) {
        // Check if driver already exists
        $existing = User::where('email', $driverData['email'])->first();
        if (!$existing) {
            $driver = User::create($driverData);
            $createdDrivers[] = $driver;
        }
    }

    return response()->json([
        'success' => true,
        'message' => 'Test drivers created successfully',
        'data' => $createdDrivers
    ]);
});

// Register new user
Route::post('/register', function (Request $request) {
    $request->validate([
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

    // Check if user exists
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'No account found with this email address.',
            'error_type' => 'user_not_found'
        ], 401);
    }

    // Check if password is correct
    if (!Hash::check($request->password, $user->password)) {
        return response()->json([
            'success' => false,
            'message' => 'The password you entered is incorrect. Please check your password and try again.',
            'error_type' => 'invalid_password'
        ], 401);
    }

    // Check if user is active/not blocked
    if (!$user->is_active) {
        return response()->json([
            'success' => false,
            'message' => 'Your account has been blocked by an administrator. Please contact support for assistance.',
            'error_type' => 'account_blocked'
        ], 403);
    }

    // Create a simple token (in production, use Laravel Sanctum)
    $token = base64_encode($user->id . '|' . $user->email . '|' . now()->timestamp);

    return response()->json([
        'success' => true,
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

// Test authentication endpoint
Route::middleware(['simple.token'])->post('/test-auth', function (Request $request) {
    $user = $request->user();
    return response()->json([
        'success' => true,
        'message' => 'Authentication working',
        'user' => $user,
        'is_admin' => $user->user_type === 'admin'
    ]);
});

// Simple authentication middleware for demo
Route::middleware(['api'])->group(function () {
    // For demo purposes, we'll make these routes accessible without strict auth
    // In production, you should use Laravel Sanctum or Passport
    Route::get('/profile/{id?}', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/picture', [ProfileController::class, 'uploadProfilePicture']);
});

// Trucks API endpoints
Route::get('/trucks', function () {
    $trucks = Truck::all();
    
    return response()->json([
        'success' => true,
        'data' => $trucks
    ]);
});

Route::get('/trucks/{id}', function ($id) {
    $truck = Truck::find($id);
    
    if (!$truck) {
        return response()->json([
            'success' => false,
            'message' => 'Truck not found'
        ], 404);
    }
    
    return response()->json([
        'success' => true,
        'data' => $truck
    ]);
});

// Admin-only truck management endpoints
Route::middleware(['simple.token'])->group(function () {
    // Create new truck (admin only)
    Route::post('/trucks', function (Request $request) {
        $user = $request->user();
        
        if ($user->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }
        
        $request->validate([
            'truck_number' => 'required|string|unique:trucks',
            'model' => 'required|string',
            'plate_number' => 'required|string|unique:trucks',
            'color' => 'nullable|string',
            'year' => 'nullable|integer|min:1990|max:' . (date('Y') + 1),
            'status' => 'required|in:active,maintenance,inactive',
            'is_available' => 'nullable|boolean',
            'mileage' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string'
        ]);
        
        $truck = Truck::create([
            'truck_number' => $request->truck_number,
            'model' => $request->model,
            'plate_number' => $request->plate_number,
            'color' => $request->color,
            'year' => $request->year,
            'status' => $request->status,
            'is_available' => $request->is_available ?? true,
            'mileage' => $request->mileage,
            'notes' => $request->notes
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Truck created successfully',
            'data' => $truck
        ], 201);
    });
    
    // Update truck (admin only)
    Route::put('/trucks/{id}', function (Request $request, $id) {
        $user = $request->user();
        
        if ($user->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }
        
        $truck = Truck::find($id);
        
        if (!$truck) {
            return response()->json([
                'success' => false,
                'message' => 'Truck not found'
            ], 404);
        }
        
        $request->validate([
            'truck_number' => 'nullable|string|unique:trucks,truck_number,' . $id,
            'model' => 'nullable|string',
            'plate_number' => 'nullable|string|unique:trucks,plate_number,' . $id,
            'color' => 'nullable|string',
            'year' => 'nullable|integer|min:1990|max:' . (date('Y') + 1),
            'status' => 'nullable|in:active,maintenance,inactive',
            'is_available' => 'nullable|boolean',
            'mileage' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string'
        ]);
        
        $truck->update($request->only([
            'truck_number', 'model', 'plate_number', 'color', 'year', 
            'status', 'is_available', 'mileage', 'notes'
        ]));
        
        return response()->json([
            'success' => true,
            'message' => 'Truck updated successfully',
            'data' => $truck->fresh()
        ]);
    });
    
    // Delete truck (admin only)
    Route::delete('/trucks/{id}', function (Request $request, $id) {
        $user = $request->user();
        
        if ($user->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }
        
        $truck = Truck::find($id);
        
        if (!$truck) {
            return response()->json([
                'success' => false,
                'message' => 'Truck not found'
            ], 404);
        }
        
        // Check if truck has active trips
        $activeTrips = Trip::where('truck_id', $id)
                          ->where('status', '!=', 'completed')
                          ->count();
        
        if ($activeTrips > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete truck with active trips'
            ], 400);
        }
        
        $truck->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Truck deleted successfully'
        ]);
    });
    
    // Toggle truck availability (admin only)
    Route::patch('/trucks/{id}/availability', function (Request $request, $id) {
        $user = $request->user();
        
        if ($user->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }
        
        $truck = Truck::find($id);
        
        if (!$truck) {
            return response()->json([
                'success' => false,
                'message' => 'Truck not found'
            ], 404);
        }
        
        $request->validate([
            'is_available' => 'required|boolean'
        ]);
        
        $truck->update(['is_available' => $request->is_available]);
        
        return response()->json([
            'success' => true,
            'message' => 'Truck availability updated successfully',
            'data' => $truck->fresh()
        ]);
    });
});

// Create sample trucks endpoint
Route::post('/create-sample-trucks', function () {
    $trucks = [
        [
            'truck_number' => 'LT-001',
            'model' => 'Freightliner Cascadia',
            'plate_number' => 'ABC-1234',
            'color' => 'Blue',
            'year' => 2022,
            'status' => 'active',
            'is_available' => true,
            'mileage' => 45000.50,
            'notes' => 'Primary delivery truck for Metro Manila routes'
        ],
        [
            'truck_number' => 'LT-002',
            'model' => 'Peterbilt 579',
            'plate_number' => 'XYZ-5678',
            'color' => 'Red',
            'year' => 2021,
            'status' => 'active',
            'is_available' => true,
            'mileage' => 67500.25,
            'notes' => 'Long-haul truck for Luzon routes'
        ],
        [
            'truck_number' => 'LT-003',
            'model' => 'Kenworth T680',
            'plate_number' => 'DEF-9012',
            'color' => 'White',
            'year' => 2023,
            'status' => 'maintenance',
            'is_available' => false,
            'mileage' => 12000.00,
            'notes' => 'Newest addition to fleet, currently in scheduled maintenance'
        ],
        [
            'truck_number' => 'LT-004',
            'model' => 'Volvo VNL 860',
            'plate_number' => 'GHI-3456',
            'color' => 'Black',
            'year' => 2020,
            'status' => 'active',
            'is_available' => false,
            'mileage' => 89250.75,
            'notes' => 'Heavy-duty truck for special cargo deliveries'
        ]
    ];
    
    foreach ($trucks as $truckData) {
        Truck::updateOrCreate(
            ['truck_number' => $truckData['truck_number']],
            $truckData
        );
    }
    
    return response()->json([
        'success' => true,
        'message' => 'Sample trucks created successfully',
        'data' => Truck::all()
    ]);
});

// Trips API endpoints
Route::get('/trips', function () {
    $trips = Trip::with(['truck', 'driver'])->orderBy('trip_date', 'desc')->get();
    
    return response()->json([
        'success' => true,
        'data' => $trips
    ]);
});

Route::get('/trips/{id}', function ($id) {
    $trip = Trip::with(['truck', 'driver'])->find($id);
    
    if (!$trip) {
        return response()->json([
            'success' => false,
            'message' => 'Trip not found'
        ], 404);
    }
    
    return response()->json([
        'success' => true,
        'data' => $trip
    ]);
});

// Assign driver to trip
Route::put('/trips/{id}/assign-driver', function (Request $request, $id) {
    $trip = Trip::find($id);
    
    if (!$trip) {
        return response()->json([
            'success' => false,
            'message' => 'Trip not found'
        ], 404);
    }
    
    $request->validate([
        'driver_id' => 'required|exists:users,id'
    ]);
    
    // Verify the user is actually a driver
    $driver = User::where('id', $request->driver_id)
                 ->where('user_type', 'driver')
                 ->first();
    
    if (!$driver) {
        return response()->json([
            'success' => false,
            'message' => 'Selected user is not a driver'
        ], 400);
    }
    
    $trip->driver_id = $request->driver_id;
    $trip->status = 'assigned';
    $trip->save();
    
    return response()->json([
        'success' => true,
        'message' => 'Driver assigned successfully',
        'data' => $trip->load(['truck', 'driver'])
    ]);
});

// Unassign driver from trip
Route::post('/trips/{id}/unassign-driver', function ($id) {
    $trip = Trip::find($id);
    
    if (!$trip) {
        return response()->json([
            'success' => false,
            'message' => 'Trip not found'
        ], 404);
    }
    
    $trip->driver_id = null;
    $trip->status = 'pending';
    $trip->save();
    
    return response()->json([
        'success' => true,
        'message' => 'Driver unassigned successfully',
        'data' => $trip->load(['truck', 'driver'])
    ]);
});

// Get trips for a specific driver
Route::get('/drivers/{driverId}/trips', function ($driverId) {
    // Verify the driver exists
    $driver = User::where('id', $driverId)
                 ->where('user_type', 'driver')
                 ->first();
    
    if (!$driver) {
        return response()->json([
            'success' => false,
            'message' => 'Driver not found'
        ], 404);
    }
    
    // Get trips assigned to this driver
    $trips = Trip::with(['truck', 'driver'])
                ->where('driver_id', $driverId)
                ->orderBy('trip_date', 'asc')
                ->get();
    
    return response()->json([
        'success' => true,
        'data' => $trips,
        'driver' => $driver
    ]);
});

// Create sample trips endpoint
Route::post('/create-sample-trips', function () {
    // Get available trucks
    $trucks = Truck::where('status', 'active')->get();
    
    if ($trucks->isEmpty()) {
        return response()->json([
            'success' => false,
            'message' => 'No active trucks available. Please create trucks first.'
        ], 400);
    }
    
    $trips = [
        [
            'trip_code' => 'TRP-' . date('Y') . '-001',
            'trip_date' => now()->addDays(1),
            'client_name' => 'ABC Manufacturing Corp',
            'client_contact' => '+63 917 123 4567',
            'client_email' => 'logistics@abcmanufacturing.com',
            'departure_point' => 'Manila Port, Manila',
            'destination' => 'Cebu Industrial Park, Cebu',
            'goods_description' => 'Electronics components and machinery parts',
            'cargo_weight' => 12.5,
            'cargo_type' => 'fragile',
            'truck_id' => $trucks->random()->id,
            'status' => 'pending',
            'estimated_cost' => 85000.00,
            'estimated_departure_time' => '06:00',
            'estimated_arrival_time' => '18:00',
            'special_instructions' => 'Handle with care - fragile electronics'
        ],
        [
            'trip_code' => 'TRP-' . date('Y') . '-002',
            'trip_date' => now()->addDays(2),
            'client_name' => 'Fresh Foods Distribution',
            'client_contact' => '+63 932 987 6543',
            'client_email' => 'orders@freshfoods.ph',
            'departure_point' => 'Baguio Vegetable Market, Baguio',
            'destination' => 'SM Mall of Asia, Pasay',
            'goods_description' => 'Fresh vegetables and fruits',
            'cargo_weight' => 8.2,
            'cargo_type' => 'perishable',
            'truck_id' => $trucks->random()->id,
            'status' => 'pending',
            'estimated_cost' => 45000.00,
            'estimated_departure_time' => '04:00',
            'estimated_arrival_time' => '12:00',
            'special_instructions' => 'Refrigerated transport required'
        ],
        [
            'trip_code' => 'TRP-' . date('Y') . '-003',
            'trip_date' => now()->addDays(3),
            'client_name' => 'Construction Plus Inc',
            'client_contact' => '+63 919 555 7890',
            'client_email' => 'procurement@constructionplus.com',
            'departure_point' => 'Bataan Steel Mill, Bataan',
            'destination' => 'BGC Construction Site, Taguig',
            'goods_description' => 'Steel beams and construction materials',
            'cargo_weight' => 25.0,
            'cargo_type' => 'heavy',
            'truck_id' => $trucks->random()->id,
            'status' => 'pending',
            'estimated_cost' => 120000.00,
            'estimated_departure_time' => '05:30',
            'estimated_arrival_time' => '14:00',
            'special_instructions' => 'Requires heavy-duty truck and special permits'
        ],
        [
            'trip_code' => 'TRP-' . date('Y') . '-004',
            'trip_date' => now()->addDays(4),
            'client_name' => 'Pharmaceutical Solutions Ltd',
            'client_contact' => '+63 928 111 2233',
            'client_email' => 'logistics@pharmasolutions.ph',
            'departure_point' => 'Pharma Warehouse, Laguna',
            'destination' => 'Medical Center, Iloilo',
            'goods_description' => 'Medical supplies and pharmaceuticals',
            'cargo_weight' => 3.8,
            'cargo_type' => 'temperature_controlled',
            'truck_id' => $trucks->random()->id,
            'status' => 'pending',
            'estimated_cost' => 95000.00,
            'estimated_departure_time' => '08:00',
            'estimated_arrival_time' => '20:00',
            'special_instructions' => 'Temperature-controlled transport. Chain of custody required.'
        ]
    ];
    
    foreach ($trips as $tripData) {
        Trip::updateOrCreate(
            ['trip_code' => $tripData['trip_code']],
            $tripData
        );
    }
    
    return response()->json([
        'success' => true,
        'message' => 'Sample trips created successfully',
        'data' => Trip::with(['truck', 'driver'])->get()
    ]);
});

// User Management Routes (Admin only)
Route::middleware(['simple.token'])->group(function () {
    // Get all users (with filtering)
    Route::get('/admin/users', function (Request $request) {
        $currentUser = $request->user();
        
        if (!$currentUser || $currentUser->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin privileges required.'
            ], 403);
        }
        
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
        $currentUser = $request->user();
        
        if (!$currentUser || $currentUser->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin privileges required.'
            ], 403);
        }
        
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
        $currentUser = $request->user();
        
        if (!$currentUser || $currentUser->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin privileges required.'
            ], 403);
        }
        
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
    Route::patch('/admin/users/{id}/toggle-status', function (Request $request, $id) {
        $currentUser = $request->user();
        
        if (!$currentUser || $currentUser->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin privileges required.'
            ], 403);
        }
        
        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);
        
        return response()->json([
            'success' => true,
            'message' => $user->is_active ? 'User activated successfully' : 'User blocked successfully',
            'data' => $user
        ]);
    });
    
    // Delete user (soft delete or permanent delete)
    Route::delete('/admin/users/{id}', function (Request $request, $id) {
        $currentUser = $request->user();
        
        if (!$currentUser || $currentUser->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin privileges required.'
            ], 403);
        }
        
        $user = User::findOrFail($id);
        $user->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    });
});

// Profile management endpoints (require authentication)
Route::middleware('api')->group(function () {
    // Get current user profile
    Route::get('/profile/{id?}', [App\Http\Controllers\API\ProfileController::class, 'show']);
    
    // Update current user profile
    Route::match(['PUT', 'PATCH'], '/profile', [App\Http\Controllers\API\ProfileController::class, 'update']);
    
    // Upload profile picture
    Route::post('/profile/picture', [App\Http\Controllers\API\ProfileController::class, 'uploadProfilePicture']);
    Route::post('/profile/upload-picture', [App\Http\Controllers\API\ProfileController::class, 'uploadProfilePicture']);
});

// Tasks API endpoints
Route::get('/tasks', function (Request $request) {
    // For now, return empty array as tasks aren't implemented yet
    return response()->json([
        'success' => true,
        'data' => []
    ]);
});

Route::post('/tasks', function (Request $request) {
    // Placeholder for creating tasks
    return response()->json([
        'success' => true,
        'message' => 'Task creation not implemented yet',
        'data' => []
    ]);
});

Route::put('/tasks/{id}', function (Request $request, $id) {
    // Placeholder for updating tasks
    return response()->json([
        'success' => true,
        'message' => 'Task update not implemented yet',
        'data' => []
    ]);
});

Route::delete('/tasks/{id}', function (Request $request, $id) {
    // Placeholder for deleting tasks
    return response()->json([
        'success' => true,
        'message' => 'Task deletion not implemented yet'
    ]);
});

