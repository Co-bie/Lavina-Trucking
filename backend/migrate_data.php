<?php

// Simple data migration script from SQLite to MySQL
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Starting data migration from SQLite to MySQL...\n";

try {
    // Configure SQLite connection for reading old data
    $sqliteConfig = [
        'driver' => 'sqlite',
        'database' => __DIR__ . '/database/database.sqlite',
    ];
    
    config(['database.connections.sqlite_backup' => $sqliteConfig]);
    
    // Get users from SQLite
    $users = DB::connection('sqlite_backup')->table('users')->get();
    
    echo "Found " . $users->count() . " users in SQLite database.\n";
    
    if ($users->count() > 0) {
        foreach ($users as $user) {
            // Check if user already exists in MySQL
            $exists = DB::connection('mysql')->table('users')->where('email', $user->email)->exists();
            
            if (!$exists) {
                // Convert to array and insert
                $userData = (array) $user;
                DB::connection('mysql')->table('users')->insert($userData);
                echo "✓ Migrated user: " . $user->email . "\n";
            } else {
                echo "→ User already exists: " . $user->email . "\n";
            }
        }
    }
    
    echo "\n✅ Data migration completed successfully!\n";
    echo "You can now use MySQL with phpMyAdmin.\n";
    
} catch (Exception $e) {
    echo "❌ Error during migration: " . $e->getMessage() . "\n";
}
