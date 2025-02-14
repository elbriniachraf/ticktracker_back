<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;


class Category extends Model
{

    protected $fillable = ['name', 'description','slug','status'];
}
