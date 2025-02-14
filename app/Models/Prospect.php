<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;


class Prospect extends Model
{
    protected $fillable = [
        'identifiant',    // Identifiant unique pour le prospect
        'email',          // Email pour contacter le prospect
        'nom',            // Nom du prospect
        'prenom',         // Prénom du prospect
        'telephone',      // Téléphone pour le contact
        'adresse',        // Adresse complète
        'code_postal',    // Code postal
        'ville',          // Ville
        'pays',           // Pays
        'secteur_activite', // Secteur d'activité du prospect
        'interet',        // Niveau d'intérêt (par ex., "fort", "modéré", "faible")
        'source',         // Source d'acquisition du prospect (publicité, salon, etc.)
        'note',           // Notes internes sur le prospect
        'etat',           // Statut du prospect (par ex., "en cours", "converti", "abandonné")
    ];
}
