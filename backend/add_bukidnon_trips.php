<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Trip;
use App\Models\Truck;

// Get available trucks
$trucks = Truck::all();
if ($trucks->isEmpty()) {
    echo "No trucks available. Please add trucks first.\n";
    exit;
}

// Trip 1: Cement delivery within Bukidnon
$trip1 = Trip::create([
    'trip_code' => 'TRP-BUK-001',
    'trip_date' => now()->addDays(1),
    'client_name' => 'Bukidnon Construction Supplies Inc.',
    'client_contact' => '+63 912 345 6789',
    'client_email' => 'orders@bukidnonconstruction.ph',
    'departure_point' => 'Holcim Cement Plant, Cagayan de Oro',
    'destination' => 'Valencia City Construction Site, Bukidnon',
    'goods_description' => 'Portland Cement Bags (50kg each)',
    'cargo_weight' => 15.5,
    'cargo_type' => 'construction_materials',
    'truck_id' => $trucks->first()->id,
    'status' => 'pending',
    'estimated_cost' => 85000.00,
    'estimated_departure_time' => '06:00',
    'estimated_arrival_time' => '14:00',
    'special_instructions' => 'Handle with care. Protect from moisture. Delivery to warehouse bay 3.'
]);

// Trip 2: Steel bars delivery
$trip2 = Trip::create([
    'trip_code' => 'TRP-BUK-002',
    'trip_date' => now()->addDays(3),
    'client_name' => 'Malaybalay Infrastructure Development Corp.',
    'client_contact' => '+63 917 888 9999',
    'client_email' => 'procurement@midc.ph',
    'departure_point' => 'SteelAsia Manufacturing, Iligan City',
    'destination' => 'Government Complex Construction Site, Malaybalay City',
    'goods_description' => 'Reinforcing Steel Bars (Rebar) - Various sizes (10mm, 12mm, 16mm, 20mm)',
    'cargo_weight' => 22.8,
    'cargo_type' => 'construction_materials',
    'truck_id' => $trucks->count() > 1 ? $trucks->skip(1)->first()->id : $trucks->first()->id,
    'status' => 'pending',
    'estimated_cost' => 125000.00,
    'estimated_departure_time' => '05:30',
    'estimated_arrival_time' => '13:30',
    'special_instructions' => 'Heavy load - requires crane for unloading. Coordinate with site foreman Mr. Santos (+63 918 111 2222) upon arrival.'
]);

echo "Successfully created 2 trips:\n";
echo "1. {$trip1->trip_code} - {$trip1->client_name}\n";
echo "2. {$trip2->trip_code} - {$trip2->client_name}\n";
echo "Trips added to database successfully!\n";
