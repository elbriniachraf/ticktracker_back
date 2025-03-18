<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Relance extends Model
{
    protected $fillable = [
        'facture_id',  // ID de la facture concernée
        'client_id',
        'date',  // Date de la relance
        'status',  // Statut de la relance (par exemple, envoyée, en attente)
        'message',  // Message de la relance
        'amount_due'  // Montant dû
    ];

    // Relation avec la facture
    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }

    // Relation avec le client
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
