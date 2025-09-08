<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $fillable = [
        'trip_code',
        'trip_date',
        'client_name',
        'client_contact',
        'client_email',
        'departure_point',
        'destination',
        'route_notes',
        'goods_description',
        'cargo_weight',
        'cargo_type',
        'truck_id',
        'driver_id',
        'status',
        'estimated_cost',
        'actual_cost',
        'estimated_departure_time',
        'estimated_arrival_time',
        'special_instructions'
    ];

    protected $casts = [
        'trip_date' => 'date',
        'cargo_weight' => 'decimal:2',
        'estimated_cost' => 'decimal:2',
        'actual_cost' => 'decimal:2',
        'estimated_departure_time' => 'datetime:H:i',
        'estimated_arrival_time' => 'datetime:H:i',
    ];

    // Relationships
    public function truck()
    {
        return $this->belongsTo(Truck::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    // Helper methods
    public function isAssigned()
    {
        return !is_null($this->driver_id);
    }

    public function canBeAssigned()
    {
        return in_array($this->status, ['pending', 'assigned']);
    }
}
