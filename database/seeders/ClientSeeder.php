<?php
namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Générer 100 clients
        foreach (range(1, 100) as $index) {
            Client::create([
                'identifiant' => $faker->unique()->userName(),
                'email' => $faker->unique()->safeEmail(),
                'nom' => $faker->lastName(),
                'prenom' => $faker->firstName(),
                'telephone' => $faker->phoneNumber(),
                'adresse' => $faker->address(),
                'code_postal' => $faker->postcode(),
                'ville' => $faker->city(),
                'pays' => $faker->country(),
                'num_siret' => $faker->regexify('[0-9]{14}'),
                'code_ape' => $faker->regexify('[0-9]{4}[A-Z]'),
                'iban' => $faker->iban(),
                'bic' => $faker->swiftBicNumber(),
                'type' => $faker->randomElement(['particulier', 'entreprise']),
            ]);
        }
    }
}

