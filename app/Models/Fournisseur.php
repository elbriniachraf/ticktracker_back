<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Fournisseur extends Model
{
    protected $connection = 'mongodb'; // Assurez-vous de spécifier la connexion MongoDB
    protected $fillable = [
        'identifiant',            // Identifiant unique pour le fournisseur
        'email',                  // Email du fournisseur
        'nom',                    // Nom du fournisseur
        'prenom',                 // Prénom du fournisseur
        'telephone',              // Numéro de téléphone du fournisseur
        'adresse',                // Adresse complète du fournisseur
        'code_postal',            // Code postal du fournisseur
        'ville',                  // Ville du fournisseur
        'pays',                   // Pays du fournisseur
        'num_siret',              // Numéro SIRET du fournisseur
        'code_ape',               // Code APE du fournisseur
        'iban',                   // IBAN du fournisseur
        'bic',                    // Code BIC pour le fournisseur
        'type',                   // Type de fournisseur (particulier, entreprise, etc.)
        'date_creation',          // Date de création du fournisseur
        'date_derniere_mise_a_jour', // Date de la dernière mise à jour des informations du fournisseur
        'contact_principal',      // Nom de la personne à contacter
        'site_web',               // URL du site web du fournisseur
        'region',                 // Région où le fournisseur est basé
        'categorie',              // Catégorie ou secteur d'activité du fournisseur
        'conditions_paiement',    // Conditions de paiement pour le fournisseur
        'devise',                 // Devise utilisée par le fournisseur
        'statut',                 // Statut du fournisseur (actif, inactif)
        'pref_contact',           // Préférence de contact (email, téléphone, etc.)
        'logo',                   // Logo du fournisseur (image)
        'notes',                  // Notes supplémentaires concernant le fournisseur
    ];

    // Vous pouvez ajouter d'autres méthodes ou relations si nécessaire.
}
