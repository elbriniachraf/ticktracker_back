<?php

namespace Database\Seeders;

use App\Models\Fournisseur;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class FournisseurSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Générer 100 fournisseurs
        foreach (range(1, 210) as $index) {
            Fournisseur::create([
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
                'date_creation' => $faker->date(),
                'date_derniere_mise_a_jour' => $faker->date(),
                'contact_principal' => $faker->name(),
                'site_web' => $faker->url(),
                'region' => $faker->word(),
                'categorie' => $faker->word(),
                'conditions_paiement' => $faker->sentence(),
                'devise' => $faker->currencyCode(),
                'statut' => $faker->randomElement(['actif', 'inactif']),
                'pref_contact' => $faker->randomElement(['email', 'telephone']),
                'logo' => $faker->imageUrl(),
                'notes' => $faker->sentence(),
            ]);
        }
    }
}
