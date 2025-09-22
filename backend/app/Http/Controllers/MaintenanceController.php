<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceRecord;
use App\Models\Truck;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of maintenance records.
     */
    public function index(): JsonResponse
    {
        try {
            $maintenanceRecords = MaintenanceRecord::with('truck')
                ->orderBy('scheduled_date', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $maintenanceRecords,
                'message' => 'Maintenance records retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve maintenance records',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created maintenance record.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'truck_id' => 'required|integer|min:1',
                'maintenance_type' => 'required|in:routine,repair,inspection,emergency',
                'description' => 'required|string|max:255',
                'scheduled_date' => 'required|date',
                'cost' => 'nullable|numeric|min:0',
                'mileage_at_service' => 'nullable|integer|min:0',
                'service_provider' => 'nullable|string|max:255',
                'notes' => 'nullable|string'
            ]);

            // Check if truck exists separately to provide better error message
            $truck = \App\Models\Truck::find($validatedData['truck_id']);
            if (!$truck) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => ['truck_id' => ['The selected truck does not exist.']]
                ], 422);
            }

            $maintenanceRecord = MaintenanceRecord::create($validatedData);
            $maintenanceRecord->load('truck');

            return response()->json([
                'success' => true,
                'data' => $maintenanceRecord,
                'message' => 'Maintenance record created successfully'
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create maintenance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified maintenance record.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $maintenanceRecord = MaintenanceRecord::with('truck')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $maintenanceRecord,
                'message' => 'Maintenance record retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance record not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified maintenance record.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $maintenanceRecord = MaintenanceRecord::findOrFail($id);

            $validatedData = $request->validate([
                'truck_id' => 'sometimes|exists:trucks,id',
                'maintenance_type' => 'sometimes|in:routine,repair,inspection,emergency',
                'description' => 'sometimes|string|max:255',
                'scheduled_date' => 'sometimes|date',
                'completed_date' => 'nullable|date',
                'status' => 'sometimes|in:scheduled,in_progress,completed,cancelled',
                'cost' => 'nullable|numeric|min:0',
                'mileage_at_service' => 'nullable|integer|min:0',
                'service_provider' => 'nullable|string|max:255',
                'notes' => 'nullable|string'
            ]);

            // Auto-set completed_date when status changes to completed
            if (isset($validatedData['status']) && $validatedData['status'] === 'completed' && !$maintenanceRecord->completed_date) {
                $validatedData['completed_date'] = now();
            }

            $maintenanceRecord->update($validatedData);
            $maintenanceRecord->load('truck');

            return response()->json([
                'success' => true,
                'data' => $maintenanceRecord,
                'message' => 'Maintenance record updated successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update maintenance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified maintenance record.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $maintenanceRecord = MaintenanceRecord::findOrFail($id);
            $maintenanceRecord->delete();

            return response()->json([
                'success' => true,
                'message' => 'Maintenance record deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete maintenance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get maintenance records for a specific truck.
     */
    public function getByTruck(string $truckId): JsonResponse
    {
        try {
            $truck = Truck::findOrFail($truckId);
            $maintenanceRecords = $truck->maintenanceRecords()
                ->orderBy('scheduled_date', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $maintenanceRecords,
                'message' => 'Truck maintenance records retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve truck maintenance records',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
