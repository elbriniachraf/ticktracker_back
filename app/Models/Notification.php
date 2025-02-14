<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;


class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];
}
