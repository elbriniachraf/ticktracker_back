<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicesTableSeeder extends Seeder
{
    /**
     * Exécuter le seeder.
     *
     * @return void
     */
    public function run()
    {
        DB::table('services')->insert([
            [
                '_id' => '1',
                'name' => 'Service 1',
                'description' => 'Description du Service 1',
                'price' => '100',
                'private' => 'No',
                'duration' => '2 hours',
                'category_id' => '1',
                'status' => 'active',
                'start_date' => '2025-01-01',
                'end_date' => '2025-01-02',
                'service_provider' => 'Provider A',
                'location' => 'Location A',
                'rating' => '4.5',
                'features' => 'Feature 1, Feature 2',
                'image_url' => 'https://example.com/image1.jpg',
                'is_featured' => 'Yes',
                'tags' => 'tag1, tag2',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                '_id' => '2',
                'name' => 'Service 2',
                'description' => 'Description du Service 2',
                'price' => '200',
                'private' => 'Yes',
                'duration' => '1 hour',
                'category_id' => '2',
                'status' => 'inactive',
                'start_date' => '2025-02-01',
                'end_date' => '2025-02-02',
                'service_provider' => 'Provider B',
                'location' => 'Location B',
                'rating' => '4.7',
                'features' => 'Feature 3, Feature 4',
                'image_url' => 'https://example.com/image2.jpg',
                'is_featured' => 'No',
                'tags' => 'tag3, tag4',
                'created_at' => now(),
                'updated_at' => now()
            ]
            // Vous pouvez ajouter d'autres services ici
        ]);
    }
}
