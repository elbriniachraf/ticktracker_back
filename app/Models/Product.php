<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Product extends Model
{

    // Champs autorisés pour la création/mise à jour en masse
    protected $fillable = [
        'reference',
        'label',
        'category',
        'is_selling',
        'is_purchasing',
        'description',
        'public_url',
        'product_type',
        'weight',
        'length',
        'width',
        'height',
        'dimensions', // Stockera Longueur x Largeur x Hauteur sous forme de JSON
        'surface',
        'volume',
        'customs_code',
        'country_of_origin',
        'state_of_origin',
        'note',
        'tags',
        'selling_price',
        'price',
        'min_selling_price',
        'tax_rate',
    ];


    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id'); 
    }
    public function tvaRate()
    {
        return $this->belongsTo(TvaRate::class);
    }
}
