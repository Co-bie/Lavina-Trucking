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
            // Add profile picture field
            $table->string('profile_picture')->nullable()->after('email');
            // Add age field (computed from date_of_birth, but can be manually set)
            $table->integer('age')->nullable()->after('date_of_birth');
            // Add contact number field (alternative to phone)
            $table->string('contact_number')->nullable()->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['profile_picture', 'age', 'contact_number']);
        });
    }
};
