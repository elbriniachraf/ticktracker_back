<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product; // Ajoute cette ligne

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'reference' => 'PROD001',
            'label' => 'Produit Test',
            'price' => 100.00,
            'selling_price' => 120.00,
            'is_selling' => true,
            'is_purchasing' => false,
            'description' => 'Un produit de test',
            'public_url' => 'https://example.com/produit-test',
            'product_type' => 'Type A',
            'weight' => 2.5,
            'length' => 10,
            'width' => 5,
            'height' => 15,
            'surface' => 50,
            'volume' => 75,
            'customs_code' => 'CODE123',
            'country_of_origin' => 'France',
            'state_of_origin' => 'Paris',
            'note' => 'Ceci est un test',
            'category' => 'Électronique',
            'min_selling_price' => 90,
            'tax_rate' => 20,
        ]);
    }
}
