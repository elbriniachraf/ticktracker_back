<?php

namespace App\Http\Controllers;

use App\Services\TvaService;
use App\Models\Invoice; // Si tu veux récupérer les factures depuis la base de données

class InvoiceController extends Controller
{
    protected $tvaService;

    // Injection du service TvaService
    public function __construct(TvaService $tvaService)
    {
        $this->tvaService = $tvaService;
    }

    /**
     * Afficher une facture avec les calculs de TVA
     *
     * @param Invoice $invoice
     * @return \Illuminate\View\View
     */
    public function showInvoice(Invoice $invoice)
    {
        // Exemple de données
        $countryCode = 'FR'; // Code du pays
        $productTvaCategory = 'standard'; // Catégorie de TVA du produit
        $ht = 100; // Montant hors taxes (exemple)

        // Calculer le montant TTC en fonction du montant HT
        $ttc = $this->tvaService->calculateTtcFromHt($ht, $countryCode, $productTvaCategory);

        // Calculer le montant de la TVA
        $tva = $this->tvaService->calculateTva($ht, $countryCode, $productTvaCategory);

        // Retourner la vue avec les résultats
        return view('invoice.show', compact('invoice', 'ttc', 'tva'));
    }
   
}
