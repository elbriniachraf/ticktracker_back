<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;


class File extends Model
{

    protected $fillable = [
        'name',
        'extension',
        'size',
        'is_folder',
        'path',
        'is_favorite',
        'is_trashed'
    ];
}
