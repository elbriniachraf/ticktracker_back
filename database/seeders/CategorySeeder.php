<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Générer 50 catégories
        foreach (range(1, 50) as $index) {
            Category::create([
                'name' => ucfirst($faker->unique()->words(2, true)), // Nom de catégorie (2 mots uniques)
                'description' => $faker->sentence(10), // Description avec 10 mots
                'slug' => $faker->unique()->slug(), // Slug unique
                'status' => $faker->randomElement(['active', 'inactive']), // Statut actif ou inactif
            ]);
        }
    }
}
