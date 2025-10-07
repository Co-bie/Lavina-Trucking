<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Truck extends Model
{
    protected $fillable = [
        'truck_number',
        'model',
        'plate_number',
        'color',
        'year',
        'status',
        'is_available',
        'mileage',
        'notes'
    ];

    protected $casts = [
        'mileage' => 'decimal:2',
        'year' => 'integer',
        'is_available' => 'boolean',
    ];

    /**
     * Get the maintenance records for the truck.
     */
    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(MaintenanceRecord::class);
    }
}
