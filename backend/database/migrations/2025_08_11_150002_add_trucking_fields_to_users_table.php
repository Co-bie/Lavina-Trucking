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
            // Personal Information
            $table->string('phone')->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
            $table->string('city')->nullable()->after('address');
            $table->string('state')->nullable()->after('city');
            $table->string('zip_code')->nullable()->after('state');
            $table->date('date_of_birth')->nullable()->after('zip_code');
            
            // Driver Information
            $table->string('license_number')->nullable()->after('date_of_birth');
            $table->string('license_class')->nullable()->after('license_number'); // CDL-A, CDL-B, etc.
            $table->date('license_expiry')->nullable()->after('license_class');
            $table->string('endorsements')->nullable()->after('license_expiry'); // HAZMAT, Passenger, etc.
            
            // Employment Information
            $table->enum('user_type', ['admin', 'driver', 'dispatcher', 'manager'])->default('driver')->after('endorsements');
            $table->date('hire_date')->nullable()->after('user_type');
            $table->enum('employment_status', ['active', 'inactive', 'terminated', 'on_leave'])->default('active')->after('hire_date');
            $table->decimal('hourly_rate', 8, 2)->nullable()->after('employment_status');
            
            // Emergency Contact
            $table->string('emergency_contact_name')->nullable()->after('hourly_rate');
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name');
            $table->string('emergency_contact_relationship')->nullable()->after('emergency_contact_phone');
            
            // Additional fields
            $table->text('notes')->nullable()->after('emergency_contact_relationship');
            $table->boolean('is_active')->default(true)->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 'address', 'city', 'state', 'zip_code', 'date_of_birth',
                'license_number', 'license_class', 'license_expiry', 'endorsements',
                'user_type', 'hire_date', 'employment_status', 'hourly_rate',
                'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
                'notes', 'is_active'
            ]);
        });
    }
};
