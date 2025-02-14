<?php

namespace Database\Seeders;

use App\Models\Service;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Créer 50 services fictifs
        foreach (range(1, 50) as $index) {
            Service::create([
                'name' => $faker->word(),
                'description' => $faker->sentence(),
                'price' => $faker->randomFloat(2, 10, 500), // Générer un prix entre 10 et 500
                'private' => $faker->boolean(),
                'duration' => $faker->numberBetween(30, 180), // Durée aléatoire entre 30 et 180 minutes
                'category_id' => $faker->numberBetween(1, 50), // Associer à une catégorie existante
                'status' => $faker->randomElement(['active', 'inactive']),
                'start_date' => $faker->dateTimeBetween('-1 year', 'now'),
                'end_date' => $faker->dateTimeBetween('now', '+1 year'),
                'service_provider' => $faker->company(),
                'location' => $faker->city(),
                'rating' => $faker->randomFloat(2, 1, 5), // Note entre 1 et 5
                'features' => json_encode(['feature1' => $faker->word(), 'feature2' => $faker->word()]),
                'image_url' => $faker->imageUrl(),
                'is_featured' => $faker->boolean(),
                'tags' => json_encode([$faker->word(), $faker->word()]),
            ]);
        }
    }
}
