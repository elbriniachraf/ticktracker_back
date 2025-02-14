<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'nom',            // Nom du contact
        'prenom',         // Prénom du contact
        'email',          // Email du contact
        'telephone',      // Téléphone pour joindre le contact
        'fonction',       // Fonction ou rôle du contact (par ex., "directeur commercial")
        'entreprise',     // Entreprise associée au contact
        'adresse',        // Adresse physique
        'ville',          // Ville
        'pays',           // Pays
        'code_postal',    // Code postal
        'note',           // Notes internes concernant le contact
        'type',           // Type de contact (par ex., "client", "prospect", "fournisseur")
        'created_by',     // Utilisateur qui a créé ce contact (relation avec la table users)
    ];
}
