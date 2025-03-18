<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;


class FactureProduit extends Model
{

    protected $fillable = [
        'facture_id',
        'produit_id',
        'quantite',
        'prix_unitaire'
    ];

    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }

    public function produit()
    {
        return $this->belongsTo(Product::class);
    }
}
