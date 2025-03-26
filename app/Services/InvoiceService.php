<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceLine;
use App\Models\InvoiceTvaHistory;
use App\Models\TvaRate;

class InvoiceService
{
    protected $tvaService;

    public function __construct(TvaService $tvaService)
    {
        $this->tvaService = $tvaService;
    }

    public function updateInvoiceTva(Invoice $invoice)
    {
        foreach ($invoice->lines as $line) {
            $tvaRate = $this->tvaService->getRateFor(
                $invoice->client->country_code,
                $line->product->tva_category
            );

            // Si le taux de TVA a changé, on enregistre l'historique
            if ($line->tva_rate_id !== $tvaRate->id) {
                // Historique de la modification
                InvoiceTvaHistory::create([
                    'invoice_line_id' => $line->id,
                    'old_tva_rate_id' => $line->tva_rate_id,
                    'new_tva_rate_id' => $tvaRate->id,
                    'old_tva_amount' => $line->tva_amount,
                    'new_tva_amount' => $line->price * $tvaRate->rate,
                ]);

                // Mise à jour de la ligne de facture
                $line->tva_rate_id = $tvaRate->id;
                $line->tva_amount = $line->price * $tvaRate->rate;
                $line->save();
            }
        }
    }
}
