<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;


class CalendarEvent extends Model
{

    protected $fillable = [
        'title',
        'startDate',
        'endDate',
        'category',
    ];
}
