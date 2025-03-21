<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Si le nom de la table est "category" (au singulier), Laravel l'utilisera automatiquement.
    protected $table = 'category';

    // Définissez les colonnes que vous pouvez remplir
    protected $fillable = ['name', 'description', 'slug', 'status'];
}
