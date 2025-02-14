<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;


class Message extends Model
{
    use HasFactory;

    protected $fillable = [
       
        'message',
        'sender_id',
        'receiver_id'
    ];

    // Définir les relations si nécessaire
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
