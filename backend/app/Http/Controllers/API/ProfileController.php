<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile information
     */
    public function show(Request $request, $id = null)
    {
        // For demo purposes, check for user_id in request to simulate authentication
        $userId = $request->input('user_id') ?? $request->header('X-User-ID');
        
        if ($userId) {
            $user = User::find($userId);
        } elseif ($id) {
            $user = User::find($id);
        } else {
            // Fallback to first user for demo
            $user = User::first();
        }
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'profile_picture' => $user->profile_picture,
                'age' => $user->age,
                'contact_number' => $user->contact_number,
                'phone' => $user->phone,
                'address' => $user->address,
                'city' => $user->city,
                'state' => $user->state,
                'zip_code' => $user->zip_code,
                'date_of_birth' => $user->date_of_birth,
                'emergency_contact_name' => $user->emergency_contact_name,
                'emergency_contact_phone' => $user->emergency_contact_phone,
                'emergency_contact_relationship' => $user->emergency_contact_relationship,
                'user_type' => $user->user_type,
                'license_number' => $user->license_number,
                'license_class' => $user->license_class,
                'license_expiry' => $user->license_expiry,
                'endorsements' => $user->endorsements,
            ]
        ]);
    }

    /**
     * Update the authenticated user's profile information
     */
    public function update(Request $request)
    {
        // Log the incoming request for debugging
        \Log::info('Profile update request:', $request->all());
        
        // Require user_id to be provided
        $userId = $request->input('user_id');
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'User ID is required'
            ], 400);
        }
        
        $user = User::find($userId);
        
        if (!$user) {
            \Log::error('User not found with ID: ' . $userId);
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        \Log::info('Found user:', ['id' => $user->id, 'name' => $user->name]);
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'age' => 'sometimes|nullable|integer|min:18|max:100',
            'contact_number' => 'sometimes|nullable|string|max:20',
            'phone' => 'sometimes|nullable|string|max:20',
            'address' => 'sometimes|nullable|string|max:500',
            'city' => 'sometimes|nullable|string|max:100',
            'state' => 'sometimes|nullable|string|max:100',
            'zip_code' => 'sometimes|nullable|string|max:10',
            'date_of_birth' => 'sometimes|nullable|date|before:today',
            'emergency_contact_name' => 'sometimes|nullable|string|max:255',
            'emergency_contact_phone' => 'sometimes|nullable|string|max:20',
            'emergency_contact_relationship' => 'sometimes|nullable|string|max:100',
            'license_number' => 'sometimes|nullable|string|max:50',
            'license_class' => 'sometimes|nullable|string|max:10',
            'license_expiry' => 'sometimes|nullable|date|after:today',
            'endorsements' => 'sometimes|nullable|string|max:255',
            'user_id' => 'sometimes|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        
        \Log::info('Validated data received:', $validated);

        // Remove user_id from validated data as it's not a user field
        unset($validated['user_id']);
        
        // Convert empty strings to null for optional fields
        foreach ($validated as $key => $value) {
            if (is_string($value) && trim($value) === '') {
                $validated[$key] = null;
            }
        }

        \Log::info('Data to update (after processing empty strings):', $validated);

        // Update user profile (without handling profile picture here)
        $updateResult = $user->update($validated);
        
        \Log::info('Update result:', ['success' => $updateResult, 'updated_fields' => array_keys($validated)]);
        
        // Refresh the user model to get updated data
        $user->refresh();
        
        \Log::info('User after update:', $user->only(['id', 'name', 'first_name', 'last_name', 'age', 'phone', 'contact_number', 'address', 'city', 'emergency_contact_name']));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'profile_picture' => $user->profile_picture,
                'age' => $user->age,
                'contact_number' => $user->contact_number,
                'phone' => $user->phone,
                'address' => $user->address,
                'city' => $user->city,
                'state' => $user->state,
                'zip_code' => $user->zip_code,
                'date_of_birth' => $user->date_of_birth,
                'emergency_contact_name' => $user->emergency_contact_name,
                'emergency_contact_phone' => $user->emergency_contact_phone,
                'emergency_contact_relationship' => $user->emergency_contact_relationship,
                'user_type' => $user->user_type,
                'license_number' => $user->license_number,
                'license_class' => $user->license_class,
                'license_expiry' => $user->license_expiry,
                'endorsements' => $user->endorsements,
            ]
        ]);
    }

    /**
     * Upload or update profile picture
     */
    public function uploadProfilePicture(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid file',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get user by ID for demo
        $userId = $request->input('user_id');
        $user = User::find($userId);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Delete old profile picture if exists
        if ($user->profile_picture && Storage::exists('public/profile_pictures/' . $user->profile_picture)) {
            Storage::delete('public/profile_pictures/' . $user->profile_picture);
        }

        $file = $request->file('profile_picture');
        $filename = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
        $file->storeAs('public/profile_pictures', $filename);

        $user->update(['profile_picture' => $filename]);

        return response()->json([
            'success' => true,
            'message' => 'Profile picture updated successfully',
            'data' => [
                'profile_picture' => $filename,
                'profile_picture_url' => asset('storage/profile_pictures/' . $filename)
            ]
        ]);
    }
}
