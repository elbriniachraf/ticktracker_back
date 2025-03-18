<?php

namespace App\Http\Controllers;

use App\Models\Avoir;
use App\Models\Facture;
use Illuminate\Http\Request;

class AvoirController extends Controller
{
    public function index()
{
    $avoirs = Avoir::with(['facture', 'client'])->get();

    // Optionnel: Vous pouvez reformater les données pour faciliter l'accès
    $avoirs->transform(function ($avoir) {
        $avoir->facture->produits->transform(function ($factureProduit) {
            // Ajouter les informations du produit dans chaque factureProduit
            $factureProduit->produit_name = $factureProduit->produit->label;
            $factureProduit->produit_quantite = $factureProduit->quantite;
            $factureProduit->produit_prix_unitaire = $factureProduit->prix_unitaire;
            return $factureProduit;
        });

        return $avoir;
    });

    return response()->json($avoirs);
}


    public function store(Request $request)
    {
        $avoir = Avoir::create([
            'facture_id' => $request->facture_id,
            'client_id' => $request->client_id,
            'date' => $request->date,
            'total_ttc' => $request->total_ttc,
            'total_ht' => $request->total_ht,
            'total_tva' => $request->total_tva,
            'reason' => $request->reason,
            'status' => 'created'  // Le statut de l'avoir au moment de sa création
        ]);
        
        return response()->json($avoir);
    }
}
