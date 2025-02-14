<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;


class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by',
        'name',
        'is_private',
    ];

    // Définir les relations
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function messages()
    {
        return $this->hasMany(Message::class,'chat_id');
    }
}
