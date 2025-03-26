<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;


class TvaCalculator
{

    // public function calculate(float $ht, string $countryCode, ?string $vatNumber = null): array
    // {
    //     // Vérifier si le N° de TVA est valide (si fourni)
    //     $isValidVat = $vatNumber ? $this->validateVatNumber($countryCode, $vatNumber) : false;

    //     // Définir le taux de TVA (exemple simplifié)
    //     $vatRate = $this->getVatRate($countryCode, $isValidVat);

    //     // Calcul du montant TTC
    //     $ttc = $ht * (1 + $vatRate / 100);

    //     return [
    //         'HT' => $ht,
    //         'TVA' => $ht * ($vatRate / 100),
    //         'TTC' => $ttc,
    //         'VAT Valid' => $isValidVat
    //     ];
    // }
    public function calculate(float $ht, string $countryCode, ?string $vatNumber = null): array
    {
        // Générer une clé de cache unique
        $cacheKey = "tva_{$ht}_{$countryCode}_" . ($vatNumber ?? "no_vat");
    
        return Cache::remember($cacheKey, 3600, function () use ($ht, $countryCode, $vatNumber) {
            // Vérifier si le N° de TVA est valide (si fourni)
            $isValidVat = $vatNumber ? $this->validateVatNumber($countryCode, $vatNumber) : false;
    
            // Définir le taux de TVA
            $vatRate = $this->getVatRate($countryCode, $isValidVat);
    
            // Calcul du montant TTC
            $ttc = $ht * (1 + $vatRate / 100);
            $tva = $ht * ($vatRate / 100);
    
            // Log de la requête et du résultat
            Log::info("Calcul TVA effectué", [
                'HT' => $ht,
                'Country' => $countryCode,
                'VAT' => $vatNumber,
                'VAT Rate' => $vatRate,
                'TVA' => $tva,
                'TTC' => $ttc,
                'VAT Valid' => $isValidVat
            ]);
    
            return [
                'HT' => $ht,
                'TVA' => $tva,
                'TTC' => $ttc,
                'VAT Valid' => $isValidVat
            ];
        });
    }

    private function validateVatNumber(string $countryCode, string $vatNumber): bool
    {
        $url = "https://ec.europa.eu/taxation_customs/vies/rest-api/ms/$countryCode/vat/$vatNumber";
        $response = Http::get($url);
    
        // Affiche la réponse brute de l'API pour vérifier ce qui est renvoyé
        dd($response->body());
    
        if ($response->successful()) {
            $responseJson = $response->json();
            Log::info("Réponse API VAT", [
                'countryCode' => $countryCode,
                'vatNumber' => $vatNumber,
                'response' => $responseJson
            ]);
    
            // Vérifie si le champ 'valid' existe dans la réponse
            return $responseJson['valid'] ?? false;
        } else {
            Log::error("Erreur API VAT", [
                'countryCode' => $countryCode,
                'vatNumber' => $vatNumber,
                'status_code' => $response->status(),
                'body' => $response->body()
            ]);
        }
    
        return false;
    }
    
    
    

    private function getVatRate(string $countryCode, bool $isValidVat): float
    {
        // Définir les taux de TVA pour différents pays
        $vatRates = [
            'FR' => 20.0,
            'DE' => 19.0,
            'ES' => 21.0,
            'IT' => 22.0,
            'BE' => 21.0
        ];

        // Si le numéro de TVA est valide, appliquer un taux de 0 (exonération de TVA)
        return ($isValidVat) ? 0.0 : ($vatRates[$countryCode] ?? 20.0);
    }

    public function calculateTtcFromHt(float $ht, float $rate): float
    {
        return $ht * (1 + $rate / 100);
    }

    /**
     * Calculer le montant HT à partir de TTC en utilisant le taux de TVA
     *
     * @param float $ttc Montant TTC
     * @param float $rate Taux de TVA
     * @return float Montant HT
     */
    public function calculateHtFromTtc(float $ttc, float $rate): float
    {
        return $ttc / (1 + $rate / 100);
    }

    /**
     * Calculer le montant de la TVA à partir du montant HT
     *
     * @param float $ht Montant hors taxes
     * @param float $rate Taux de TVA
     * @return float Montant de la TVA
     */
    public function calculateTva(float $ht, float $rate): float
    {
        return $ht * ($rate / 100);
    }
}

