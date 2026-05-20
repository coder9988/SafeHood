<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    protected $fillable = [
        'user_id', 'title', 'description', 'category', 'severity',
        'location', 'image', 'anonymous', 'status'
    ];

    protected $casts = ['anonymous' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
