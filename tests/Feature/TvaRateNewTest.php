<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\TvaRate;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TvaRateNewTest extends TestCase
{
    use RefreshDatabase;

    // Test pour vérifier si tu peux récupérer les taux de TVA
    // public function test_can_get_tva_rates()
    // {
    //     $response = $this->getJson('/api/tva/rates');

    //     $response->assertStatus(200);
    // }

    // // Test pour vérifier la création d'un nouveau taux de TVA
    // public function test_can_create_tva_rate()
    // {
    //     $response = $this->postJson('/api/tva/rates', [
    //         'rate' => 15,
    //         'valid_from' => '2024-02-01',
    //         'valid_until' => '2024-12-31',
    //     ]);

    //     $response->assertStatus(201); // Le statut attendu lors de la création
    // }

    // // Test pour vérifier la mise à jour d'un taux de TVA existant
    // public function test_can_update_tva_rate()
    // {
    //     $tvaRate = TvaRate::factory()->create();

    //     $response = $this->putJson('/api/tva/rates/' . $tvaRate->id, [
    //         'rate' => 18,
    //         'valid_from' => '2024-02-01',
    //         'valid_until' => '2024-12-31',
    //     ]);

    //     $response->assertStatus(200); // Vérifier que le taux a bien été mis à jour
    // }

    // // Test pour vérifier qu'un taux de TVA existant ne peut pas être créé s'il se chevauche avec un autre taux
    // public function test_cannot_create_tva_rate_if_overlapping()
    // {
    //     // Crée un taux de TVA existant
    //     $existingRate = TvaRate::create([
    //         'rate' => 20,
    //         'valid_from' => '2024-01-01',
    //         'valid_until' => '2024-12-31',
    //         'country_code' => 'FR',
    //     ]);

    //     // Essayer de créer un taux qui chevauche
    //     $response = $this->postJson('/api/tva/rates', [
    //         'rate' => 62.19,
    //         'valid_from' => '2024-02-01',
    //         'valid_until' => '2024-12-31',
    //         'country_code' => 'FR',  // Vérifiez cette ligne
    //     ]);
        
    //     $response->assertStatus(422); // Vérifie que l'erreur de chevauchement est bien gérée
    // }

    // // Test pour vérifier la désactivation d'un taux de TVA
    // public function test_can_deactivate_tva_rate()
    // {
    //     $tvaRate = TvaRate::factory()->create();

    //     $response = $this->deleteJson('/api/tva/rates/' . $tvaRate->id);

    //     $response->assertStatus(200);
    //     $this->assertFalse($tvaRate->fresh()->is_active); // Vérifie que le taux est désactivé
    // }
}
