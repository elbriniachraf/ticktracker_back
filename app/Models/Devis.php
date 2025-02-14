<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;


class Devis extends Model
{

    protected $fillable = [
        'client',  // Assure-toi que ces champs existent dans ta table 'devis'
        'client_id',  // Assure-toi que ces champs existent dans ta table 'devis'
        'date',
        'produits', // tu peux transformer ce champ en format JSON si nécessaire
        'totalHT',
        'totalTVA',
        'totalTTC',
        'statut',
    ];

    // Si les produits doivent être un tableau JSON, tu peux ajouter un accessor dans le modèle
    protected $casts = [
        'produits' => 'array', // Transforme les produits en tableau JSON
    ];
}
