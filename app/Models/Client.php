<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Client extends Model
{
    protected $connection = 'mongodb'; // Assurez-vous de spécifier la connexion MongoDB
    protected $fillable = [
        'identifiant', 'email', 'nom', 'prenom', 'telephone', 'adresse', 
        'code_postal', 'ville', 'pays', 'num_siret', 'code_ape', 'iban', 
        'bic', 'type'
    ];
}
