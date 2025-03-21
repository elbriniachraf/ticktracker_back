<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Service extends Model
{

    // Définir les attributs qui peuvent être massivement assignés
    protected $fillable = [
        'name', 
        'description', 
        'price',
        'private', 
        'duration',
        'category_id', 
        'status', // Statut du service (actif/inactif)
        'start_date', // Date de début
        'end_date', // Date de fin
        'service_provider', // Fournisseur du service
        'location', // Localisation du service
        'rating', // Note du service
        'features', // Caractéristiques sous forme JSON
        'image_url', // URL de l'image représentant le service
        'is_featured', // Marquer le service comme mis en avant
        'tags' // Liste de mots-clés associés au service (peut être un champ JSON)
    ];

    // Définir une relation avec la table Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Convertir les champs JSON en tableau pour manipulation
    protected $casts = [
        'features' => 'array',  // Convertir en tableau PHP
        'tags' => 'array',      // Convertir en tableau PHP
        'start_date' => 'datetime',  // Convertir en instance Carbon
        'end_date' => 'datetime',    // Convertir en instance Carbon
    ];
}
