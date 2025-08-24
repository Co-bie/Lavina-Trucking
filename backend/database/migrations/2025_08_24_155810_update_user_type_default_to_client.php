<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Update the user_type enum to include 'client' and set 'client' as default
            $table->enum('user_type', ['admin', 'driver', 'dispatcher', 'manager', 'client'])->default('client')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revert back to original enum values with 'driver' as default
            $table->enum('user_type', ['admin', 'driver', 'dispatcher', 'manager'])->default('driver')->change();
        });
    }
};
