<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('category')->insert([
            [
                'name' => 'Électronique',
                'description' => 'Produits électroniques comme les téléphones et ordinateurs.',
                'slug' => 'electronique',
                'status' => 'active',
            ],
            [
                'name' => 'Vêtements',
                'description' => 'Vêtements pour hommes et femmes.',
                'slug' => 'vetements',
                'status' => 'active',
            ],
            [
                'name' => 'Maison et jardin',
                'description' => 'Meubles, décoration et outils de jardinage.',
                'slug' => 'maison-jardin',
                'status' => 'active',
            ],
            [
                'name' => 'Sports',
                'description' => 'Articles de sport et équipements pour les activités extérieures.',
                'slug' => 'sports',
                'status' => 'active',
            ],
        ]);
    }
}
