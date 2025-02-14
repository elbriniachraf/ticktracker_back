<?php

namespace Database\Seeders;

use App\Models\Prospect;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ProspectSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Générer 100 prospects
        foreach (range(1, 100) as $index) {
            Prospect::create([
                'identifiant' => $faker->unique()->userName(),
                'email' => $faker->unique()->safeEmail(),
                'nom' => $faker->lastName(),
                'prenom' => $faker->firstName(),
                'telephone' => $faker->phoneNumber(),
                'adresse' => $faker->address(),
                'code_postal' => $faker->postcode(),
                'ville' => $faker->city(),
                'pays' => $faker->country(),
                'secteur_activite' => $faker->companySuffix(),
                'interet' => $faker->randomElement(['fort', 'modéré', 'faible']),
                'source' => $faker->randomElement(['publicité', 'salon', 'recommandation', 'autre']),
                'note' => $faker->sentence(6),
                'etat' => $faker->randomElement(['en cours', 'converti', 'abandonné']),
            ]);
        }
    }
}
