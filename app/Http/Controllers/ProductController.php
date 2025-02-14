<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Devis;
use App\Models\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Mail\DevisMail;

class ProductController extends Controller
{
    // Fonction pour récupérer les produits
    public function index(Request $request)
    {
        $query = Product::query();

        // Pagination
        $pageSize = $request->get('pageSize', 10);

        // Filtrage par type de produit
        if ($request->has('product_type')) {
            $query->where('product_type', $request->get('product_type'));
        }

        // Filtrage par recherche (query)
        if ($request->has('query')) {
            $search = $request->get('query');
            $query->where(function ($q) use ($search) {
                $q->where('label', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%")
                  ->orWhere('reference', 'like', "%$search%");
            });
        }

        // Pagination et résultats
        $products = $query->paginate($pageSize);

        return response()->json($products);
    }

    // Fonction pour supprimer un produit
    public function destroy(Request $request)
    {
        $id = $request->input('id');

        // Trouver le produit par son ID
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Produit non trouvé.'], 404);
        }

        // Supprimer le produit
        $product->delete();

        return response()->json(['message' => 'Produit supprimé avec succès.'], 200);
    }


    public function mettreAJourDevis(Request $request, $id)
    {
        $devis = Devis::findOrFail($id);
        $devis->statut = $request->statut;
        $devis->save();

        return response()->json([
            'message' => 'Le devis a été mis à jour avec succès.',
            'devis' => $devis
        ], 200);
    }

    /**
     * Envoyer un devis par mail.
     */
    public function envoyerParMail(Request $request ,$id)
    {
        $devis = Devis::findOrFail($id);

        $client=Client::where('_id',$devis->client_id)->first();
    
        $clientEmail = $client->email; // Assurez-vous que l'email est stocké

        if (!$clientEmail) {
            return response()->json(['message' => 'Adresse email du client introuvable.'], 400);
        }

        Mail::to($clientEmail)->send(new DevisMail($devis));

        return response()->json([
            'message' => 'Le devis a été envoyé par mail avec succès.',
            'client'=>$client
        ], 200);
    }

    /**
     * Récupérer un devis par ID.
     */
    public function getDevisById($id)
    {
        $devis = Devis::findOrFail($id);
        return response()->json($devis, 200);
    }

    // Fonction pour ajouter un produit
    public function store(Request $request)
    {
        // Validation des données
        $validatedData = $request->validate([
            'reference' => 'required|string|max:255|unique:products,reference',
            'label' => 'required|string|max:255',
            'price' => 'required|numeric',
            'selling_price' => 'required|numeric',
            'is_selling' => 'nullable|boolean',
            'is_purchasing' => 'nullable|boolean',
            'description' => 'nullable|string',
            'public_url' => 'nullable|url',
            'product_type' => 'nullable|string|max:100',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array', // Assurez-vous que c'est un tableau (JSON)
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'surface' => 'nullable|numeric|min:0',
            'volume' => 'nullable|numeric|min:0',
            'customs_code' => 'nullable|string|max:20',
            'country_of_origin' => 'nullable|string|max:100',
            'state_of_origin' => 'nullable|string|max:100',
            'note' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array', // Assurez-vous que c'est un tableau (JSON)
            'min_selling_price' => 'nullable|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
        ]);

        // Création du produit
        $product = Product::create($validatedData);

        return response()->json([
            'message' => 'Produit ajouté avec succès',
            'product' => $product
        ], 201);
    }

    public function searchProducts(Request $request)
    {
        // Récupérer le terme de recherche
        $searchTerm = $request->query('search');

        // Si le terme de recherche est défini, effectuer une recherche sur le modèle Product
        $products = Product::where('label', 'like', '%' . $searchTerm . '%')->get();

        // Retourner les résultats sous forme de réponse JSON
        return response()->json($products);
    }


     // Méthode pour récupérer tous les devis
     public function indexDevis(Request $request)
     {
         // Si tu veux ajouter un filtre basé sur un paramètre GET comme 'client'
         $query = Devis::query();
 
         // Si le paramètre 'client' est passé dans la requête, filtrer les devis par client
         if ($request->has('client')) {
             $query->where('client', 'like', '%' . $request->client . '%');
         }
 
         // Récupérer tous les devis
         $devis = $query->get();
 
         return response()->json($devis);
     }

    public function storeDevis(Request $request)
    {
        // Validation des données
        $validated = $request->validate([
            'client' => 'required|string',
            'client_id' => 'required|string',
            'date' => 'required|date',
            'produits' => 'required|array',
            'produits.*.produitInput' => 'required|string',
            'produits.*.prix' => 'required|numeric',
            'produits.*.quantite' => 'required|numeric',
            'totalHT' => 'required|numeric',
            'totalTVA' => 'required|numeric',
            'totalTTC' => 'required|numeric',
            'statut' => 'nullable|string|in:Brouillon,Finalisé', // Optionnel
        ]);

        // Créer le devis
        $devis = Devis::create([
            'client' => $validated['client'],
            'client_id' => $validated['client_id'],
            'date' => $validated['date'],
            'produits' => json_encode($validated['produits']), // Encode en JSON les produits
            'totalHT' => $validated['totalHT'],
            'totalTVA' => $validated['totalTVA'],
            'totalTTC' => $validated['totalTTC'],
            'statut' => $validated['statut'] ?? 'Brouillon', // Si 'statut' n'est pas fourni, par défaut 'Brouillon'
        ]);

        return response()->json($devis, 201); // Retourner le devis créé avec un code de succès 201
    }
}
