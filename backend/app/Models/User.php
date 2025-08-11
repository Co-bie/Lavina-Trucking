<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'password',
        // Personal Information
        'phone',
        'address',
        'city',
        'state',
        'zip_code',
        'date_of_birth',
        // Driver Information
        'license_number',
        'license_class',
        'license_expiry',
        'endorsements',
        // Employment Information
        'user_type',
        'hire_date',
        'employment_status',
        'hourly_rate',
        // Emergency Contact
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        // Additional fields
        'notes',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'license_expiry' => 'date',
            'hire_date' => 'date',
            'hourly_rate' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }
}
