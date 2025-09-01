<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

echo "\n📊 LAVINA TRUCKING DATABASE CONTENTS\n";
echo "=====================================\n\n";

try {
    $users = User::all();
    
    echo "👥 USERS TABLE (" . $users->count() . " records)\n";
    echo "----------------------------------------\n";
    
    if ($users->count() > 0) {
        foreach ($users as $user) {
            echo "ID: " . $user->id . "\n";
            echo "Name: " . ($user->name ?? 'N/A') . "\n";
            echo "First Name: " . ($user->first_name ?? 'N/A') . "\n";
            echo "Last Name: " . ($user->last_name ?? 'N/A') . "\n";
            echo "Email: " . $user->email . "\n";
            echo "User Type: " . ($user->user_type ?? 'N/A') . "\n";
            echo "Employment Status: " . ($user->employment_status ?? 'N/A') . "\n";
            echo "Active: " . ($user->is_active ? 'Yes' : 'No') . "\n";
            echo "Created: " . ($user->created_at ? $user->created_at->format('Y-m-d H:i:s') : 'N/A') . "\n";
            echo "Updated: " . ($user->updated_at ? $user->updated_at->format('Y-m-d H:i:s') : 'N/A') . "\n";
            echo "----------------------------------------\n";
        }
        
        echo "\n🔐 LOGIN CREDENTIALS:\n";
        echo "Email: test@example.com\n";
        echo "Password: password123\n\n";
        
    } else {
        echo "No users found in database.\n";
    }
    
    echo "✅ Database connection successful!\n";
    echo "📍 Database: MySQL (lavina_trucking)\n";
    echo "🌐 phpMyAdmin: http://localhost/phpmyadmin\n";
    echo "🌐 Laravel App: http://127.0.0.1:8000\n\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
