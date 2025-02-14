<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Générer 100 contacts
        foreach (range(1, 100) as $index) {
            Contact::create([
                'nom' => $faker->lastName(),
                'prenom' => $faker->firstName(),
                'email' => $faker->unique()->safeEmail(),
                'telephone' => $faker->phoneNumber(),
                'fonction' => $faker->jobTitle(),
                'entreprise' => $faker->company(),
                'adresse' => $faker->address(),
                'ville' => $faker->city(),
                'pays' => $faker->country(),
                'code_postal' => $faker->postcode(),
                'note' => $faker->sentence(6),
                'type' => $faker->randomElement(['client', 'prospect', 'fournisseur']),
                'created_by' => $faker->numberBetween(1, 10), // ID utilisateur aléatoire entre 1 et 10
            ]);
        }
    }
}
