<?php

namespace Database\Factories;

use App\Models\TvaRate;
use Illuminate\Database\Eloquent\Factories\Factory;

class TvaRateFactory extends Factory
{
    protected $model = TvaRate::class;

    public function definition()
    {
        return [
            'rate' => $this->faker->randomFloat(2, 0, 100),
            'valid_from' => $this->faker->date(),
            'valid_until' => $this->faker->date(),
            'country_code' => $this->faker->countryCode(),
        ];
    }
}
