<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FraisDeplacement extends Model
{

    // Définir les champs autorisés pour l'assignation en masse
    protected $fillable = [
        'client',
        'date',
        'montant',
        'motif',
    ];

    // Si vous utilisez des timestamps personnalisés
    // public $timestamps = false;

    // Vous pouvez ajouter des relations si nécessaire
    // Exemple : Si chaque frais de déplacement est associé à un client (par exemple, un modèle Client)
    // public function client()
    // {
    //     return $this->belongsTo(Client::class);
    // }
}
