<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;


class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_date',
        'start_time',
        'end_date',
        'end_time',
        'type',
        'user_id',
        'lien',
        'color',
        'is_draft',
        'participants', // Add participants field here
    ];

    // Optionally, add a method to handle participants as an array
    public function getParticipantsAttribute($value)
    {
        return json_decode($value, true);
    }

    public function setParticipantsAttribute($value)
    {
        $this->attributes['participants'] = json_encode($value);
    }
}
