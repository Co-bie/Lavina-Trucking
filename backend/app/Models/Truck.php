<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Truck extends Model
{
    protected $fillable = [
        'truck_number',
        'model',
        'plate_number',
        'color',
        'year',
        'status',
        'mileage',
        'notes'
    ];

    protected $casts = [
        'mileage' => 'decimal:2',
        'year' => 'integer',
    ];
}
