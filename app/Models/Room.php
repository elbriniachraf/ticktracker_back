<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;


class Room extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'rooms';
    protected $fillable = [
        'room_id',
        'sender_id',
        'user_id',
        'creator_id',

        'type',
        'date',
        'duration',
    ];
}
