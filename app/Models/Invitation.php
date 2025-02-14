<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Invitation extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'invitations';

    protected $fillable = [
        'sender_id', 'receiver_id', 'name_sender', 'name_receiver', 'content','status', 'date', 'is_accepted'
    ];
}
