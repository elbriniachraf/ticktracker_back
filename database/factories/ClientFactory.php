<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition()
    {
        return [
            'identifiant' => $this->faker->unique()->userName(),
            'email' => $this->faker->unique()->safeEmail(),
            'nom' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName(),
            'telephone' => $this->faker->phoneNumber(),
            'adresse' => $this->faker->address(),
            'code_postal' => $this->faker->postcode(),
            'ville' => $this->faker->city(),
            'pays' => $this->faker->country(),
            'num_siret' => $this->faker->regexify('[0-9]{14}'),
            'code_ape' => $this->faker->regexify('[0-9]{4}[A-Z]'),
            'iban' => $this->faker->iban(),
            'bic' => $this->faker->swiftBicNumber(),
            'type' => $this->faker->randomElement(['particulier', 'entreprise']),
        ];
    }
}
