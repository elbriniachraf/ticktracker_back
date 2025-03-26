<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TvaRateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tva_rates')->insert([
            ['country_code' => 'FR', 'label' => 'Standard', 'rate' => 20, 'category' => 'STANDARD', 'is_active' => true, 'valid_from' => '2024-01-01'],
            ['country_code' => 'FR', 'label' => 'Réduit', 'rate' => 10, 'category' => 'REDUCED', 'is_active' => true, 'valid_from' => '2024-01-01'],
            ['country_code' => 'FR', 'label' => 'Super réduit', 'rate' => 5.5, 'category' => 'SUPER_REDUCED', 'is_active' => true, 'valid_from' => '2024-01-01'],
            ['country_code' => 'EU', 'label' => 'Intracommunautaire', 'rate' => 0, 'category' => 'INTRA_COMMUNITY', 'is_active' => true, 'valid_from' => '2024-01-01'],
        ]);
    }
}
