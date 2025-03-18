<?php

namespace App\Http\Controllers;

use App\Models\FraisDeplacement;
use Illuminate\Http\Request;
use App\Models\Facture;
use App\Models\Product;

use App\Models\Client;

use App\Models\FactureProduit;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
    

class FactureController extends Controller
{
    // Lister toutes les factures
    public function index()
    {
        // Récupérer toutes les factures avec le client
        $factures = Facture::with('client', 'produits')->get();
    
        // Ajouter des informations supplémentaires pour chaque produit dans chaque facture
        foreach ($factures as $facture) {
            foreach ($facture->produits as $produit) {
                // Ajouter des informations supplémentaires à chaque produit en utilisant `Product::where`
                $produitInfo = Product::where('id', $produit->product_id)->first(['_id', 'label', 'selling_price', 'price', 'tax_rate']);
                
                // Ajouter ces informations au produit
                $produit->product_info = $produitInfo;
            }
        }
    
        return response()->json($factures);
    }
    public function storeFrais(Request $request)
{
    $request->validate([
        'client' => 'required|string',
        'date' => 'required|date',
        'montant' => 'required|numeric',
        'motif' => 'required|string',
    ]);

    $frais = FraisDeplacement::create([
        'client' => $request->client,
        'date' => $request->date,
        'montant' => $request->montant,
        'motif' => $request->motif,
    ]);

    return response()->json($frais, 201);
}
public function indexFrais()
{
    $fraisDeplacements = FraisDeplacement::all();
    return response()->json($fraisDeplacements);
}


    
    
    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,_id',
            'date' => 'required|date',
            'produits' => 'required|array',
        ]);
    
        // Créer la facture
        $facture = Facture::create([
            'client_id' => $request->client_id,
            'date' => $request->date,
            'total_ttc' => $request->date, // Ce champ semble faux (date ?)
            'total_ht' => $request->total_ht ?? 0,
            'total_tva' => $request->tva ?? 0,
            'status' => 'Brouillon'
        ]);
    
        $total = 0;
        $produitsData = [];
    
        // Ajouter les produits à la facture
        foreach ($request->produits as $produit) {
            FactureProduit::create([
                'facture_id' => $facture->id,
                'produit_id' => $produit['id'],
                'quantite' => $produit['quantite'],
                'prix_unitaire' => $produit['prixUnitaire']
            ]);
    
            $total += $produit['quantite'] * $produit['prixUnitaire'];
    
            $produitsData[] = $produit;
        }
    
        // Mettre à jour le total TTC
        $facture->update(['total_ttc' => $total]);
    
        // Générer le PDF de la facture
        $pdf = Pdf::loadView('factures.template', [
            'facture' => $facture,
            'client' => Client::find($request->client_id),
            'produits' => $produitsData
        ]);
    
        // Nom du fichier
        $fileName = 'facture_' . $facture->id . '.pdf';
        $facturesPath = public_path('factures');

if (!file_exists($facturesPath)) {
    mkdir($facturesPath, 0777, true);
}



    
        // Enregistrer dans public/factures
        $pdf->save(public_path('factures/' . $fileName));
    
        // Optionnel: Ajouter le chemin du PDF à la facture
        $facture->update([
            'pdf_path' => 'factures/' . $fileName
        ]);
    
        return response()->json([
            'facture' => $facture,
            'pdf_url' => asset('factures/' . $fileName)
        ], 201);
    }
    

    // Supprimer une facture
    public function destroy($id)
    {
        $facture = Facture::findOrFail($id);
        $facture->delete();
        return response()->json(['message' => 'Facture supprimée avec succès'], 200);
    }

    // Modifier une facture
    public function update(Request $request, $id)
    {
        $facture = Facture::findOrFail($id);

        $request->validate([
            'status' => 'required|in:Brouillon,Facturé,Annulé'
        ]);

        $facture->update([
            'status' => $request->status
        ]);

        return response()->json($facture);
    }

    // Afficher une facture spécifique
    public function show($id)
    {
        $facture = Facture::with('client', 'produits')->findOrFail($id);
        return response()->json($facture);
    }
}
