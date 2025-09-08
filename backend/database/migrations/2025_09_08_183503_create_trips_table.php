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
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->string('trip_code')->unique(); // Unique trip identifier
            $table->date('trip_date');
            
            // Client information
            $table->string('client_name');
            $table->string('client_contact');
            $table->string('client_email')->nullable();
            
            // Location information
            $table->string('departure_point');
            $table->string('destination');
            $table->text('route_notes')->nullable();
            
            // Cargo information
            $table->text('goods_description');
            $table->decimal('cargo_weight', 10, 2)->nullable(); // in tons
            $table->string('cargo_type')->nullable(); // fragile, hazardous, perishable, etc.
            
            // Truck assignment
            $table->foreignId('truck_id')->constrained('trucks')->onDelete('cascade');
            
            // Driver assignment (optional, can be assigned later)
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Trip status and details
            $table->enum('status', ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->decimal('estimated_cost', 10, 2)->nullable();
            $table->decimal('actual_cost', 10, 2)->nullable();
            $table->time('estimated_departure_time')->nullable();
            $table->time('estimated_arrival_time')->nullable();
            $table->text('special_instructions')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
