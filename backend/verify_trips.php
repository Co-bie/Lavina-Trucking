<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Trip;

echo "Bukidnon Construction Material Trips:\n";
echo "=====================================\n";

$trips = Trip::where('trip_code', 'like', 'TRP-BUK-%')->get();

foreach ($trips as $trip) {
    echo "\n• {$trip->trip_code}: {$trip->client_name}\n";
    echo "  From: {$trip->departure_point}\n";
    echo "  To: {$trip->destination}\n";
    echo "  Cargo: {$trip->goods_description}\n";
    echo "  Weight: {$trip->cargo_weight} tons\n";
    echo "  Cost: ₱" . number_format($trip->estimated_cost, 2) . "\n";
    echo "  Status: {$trip->status}\n";
}

echo "\nTotal Bukidnon trips: " . $trips->count() . "\n";
