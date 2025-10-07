<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceRecord extends Model
{
    protected $fillable = [
        'truck_id',
        'maintenance_type',
        'description',
        'scheduled_date',
        'completed_date',
        'status',
        'cost',
        'mileage_at_service',
        'service_provider',
        'notes'
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
        'completed_date' => 'datetime',
        'cost' => 'decimal:2'
    ];

    /**
     * Get the truck that this maintenance record belongs to.
     */
    public function truck(): BelongsTo
    {
        return $this->belongsTo(Truck::class);
    }
}
