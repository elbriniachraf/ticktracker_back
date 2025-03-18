<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;


class Facture extends Model
{

    protected $fillable = [
        'client_id',
        'date',
        'total_ttc',
        'total_ht',
        'total_tva',
        'pdf_path',

        'status'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function produits()
    {
        return $this->hasMany(FactureProduit::class);
    }
}
