<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Friend extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'friends';

    protected $fillable = [
        'user_id', 'friend_id', 
    ];

    /**
     * Get the user associated with the friend record.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the friend associated with the friend record.
     */
    public function friend()
    {
        return $this->belongsTo(User::class, 'friend_id');
    }
}
