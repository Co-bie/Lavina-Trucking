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
            $table->integer('age')->nullable()->after('email');
            $table->string('contact_number')->nullable()->after('age');
            $table->date('date_of_birth')->nullable()->after('contact_number');
            
            // Emergency Contact
            $table->string('emergency_contact_name')->nullable()->after('zip_code');
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name');
            $table->string('emergency_contact_relationship')->nullable()->after('emergency_contact_phone');
            
            // Driver Information
            $table->string('license_number')->nullable()->after('emergency_contact_relationship');
            $table->string('license_class')->nullable()->after('license_number');
            $table->date('license_expiry')->nullable()->after('license_class');
            $table->text('endorsements')->nullable()->after('license_expiry');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'age',
                'contact_number', 
                'date_of_birth',
                'emergency_contact_name',
                'emergency_contact_phone',
                'emergency_contact_relationship',
                'license_number',
                'license_class',
                'license_expiry',
                'endorsements'
            ]);
        });
    }
};
