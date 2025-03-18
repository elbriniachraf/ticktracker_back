<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Avoir extends Model
{
    protected $fillable = [
        'facture_id',  // ID de la facture à laquelle cet avoir est lié
        'client_id',
        'date',
        'total_ttc',
        'total_ht',
        'total_tva',
        'reason',  // Raison de l'avoir
        'status'  // Statut de l'avoir (par exemple, validé, annulé, etc.)
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
