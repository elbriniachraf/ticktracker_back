<?php

namespace App\Services;

use App\Models\TvaRate;
use App\Services\TvaCalculator;

class TvaService
{
    protected $tvaCalculator;

    // Injection de la dépendance TvaCalculator
    public function __construct(TvaCalculator $tvaCalculator)
    {
        $this->tvaCalculator = $tvaCalculator;
    }

    /**
     * Récupère le taux de TVA en fonction du pays et de la catégorie de TVA du produit.
     *
     * @param string $countryCode Code du pays
     * @param string $productTvaCategory Catégorie de TVA du produit
     * @return TvaRate
     */
    public function getRateFor($countryCode, $productTvaCategory)
    {
        return TvaRate::where('country_code', $countryCode)
            ->where('category', $productTvaCategory)
            ->first();
    }

    /**
     * Calculer le montant TTC à partir de HT en utilisant le taux de TVA
     *
     * @param float $ht Montant hors taxes
     * @param string $countryCode Code du pays
     * @param string $productTvaCategory Catégorie de TVA du produit
     * @return float Montant TTC
     */
    public function calculateTtcFromHt(float $ht, string $countryCode, string $productTvaCategory): float
    {
        // Récupère le taux de TVA
        $tvaRate = $this->getRateFor($countryCode, $productTvaCategory);
        return $this->tvaCalculator->calculateTtcFromHt($ht, $tvaRate->rate);
    }

    /**
     * Calculer le montant HT à partir de TTC en utilisant le taux de TVA
     *
     * @param float $ttc Montant TTC
     * @param string $countryCode Code du pays
     * @param string $productTvaCategory Catégorie de TVA du produit
     * @return float Montant HT
     */
    public function calculateHtFromTtc(float $ttc, string $countryCode, string $productTvaCategory): float
    {
        // Récupère le taux de TVA
        $tvaRate = $this->getRateFor($countryCode, $productTvaCategory);
        return $this->tvaCalculator->calculateHtFromTtc($ttc, $tvaRate->rate);
    }

    /**
     * Calculer le montant de la TVA à partir du montant HT
     *
     * @param float $ht Montant hors taxes
     * @param string $countryCode Code du pays
     * @param string $productTvaCategory Catégorie de TVA du produit
     * @return float Montant TVA
     */
    public function calculateTva(float $ht, string $countryCode, string $productTvaCategory): float
    {
        // Récupère le taux de TVA
        $tvaRate = $this->getRateFor($countryCode, $productTvaCategory);
        return $this->tvaCalculator->calculateTva($ht, $tvaRate->rate);
    }
}
