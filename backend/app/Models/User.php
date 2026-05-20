<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];
    protected $hidden = ['password', 'remember_token'];

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
