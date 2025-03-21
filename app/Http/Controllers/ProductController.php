<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Devis;
use App\Models\Client;
use App\Models\Category; // Assurez-vous d'importer le modèle Category
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\DevisMail; // Assurez-vous d'importer la classe DevisMail
use Illuminate\Support\Facades\DB; // Assure-toi d'importer DB

class ProductController extends Controller
{
    // Fonction pour récupérer les produits avec la description de la catégorie

public function index(Request $request)
{
    $query = Product::query();

    // Pagination
    $pageSize = $request->get('pageSize', 10);

    // Filtrage par type de produit
    // if ($request->has('product_type')) {
    //     $query->where('product_type', $request->get('product_type'));
    // }

    // // Filtrage par recherche (query)
    // if ($request->has('query')) {
    //     $search = $request->get('query');
    //     $query->where(function ($q) use ($search) {
    //         $q->where('label', 'like', "%$search%")
    //             ->orWhere('description', 'like', "%$search%")
    //             ->orWhere('reference', 'like', "%$search%");
    //     });
    // }
 // Filtrage par type de produit
 if ($request->has('product_type')) {
    $query->where('product_type', $request->get('product_type'));
}

// Filtrage par recherche (query)
if ($request->has('query')) {
    $search = $request->get('query');
    $query->where(function ($q) use ($search) {
        $q->where('label', 'like', "%$search%")
          ->orWhere('reference', 'like', "%$search%");
    });
}
    // Sélection des colonnes y compris la catégorie (sans relation)
    $products = $query->select(
        'id', 
        'reference', 
        'label', 
        'price', 
        'selling_price', 
        'height', 
        'length',
        'weight',
        'width',
        'category',
        'description',
        DB::raw('category as category_name') // Assure-toi que 'category' est bien une colonne dans la table `products`
    )->paginate($pageSize);

    // Retourner les produits au format JSON
    return response()->json($products);
}


    // Récupérer la relation 'category' dans le modèle Product
    // Vous devez vous assurer que la relation 'category' est définie dans le modèle Product
    // public function category()
    // {
    //     return $this->belongsTo(Category::class, 'category_id'); // Assurez-vous que 'category_id' est la bonne clé étrangère
    // }

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

    // Fonction pour mettre à jour un devis
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

    // Fonction pour envoyer un devis par mail
    public function envoyerParMail(Request $request, $id)
    {
        $devis = Devis::findOrFail($id);

        $client = Client::where('_id', $devis->client_id)->first();

        $clientEmail = $client->email; // Assurez-vous que l'email est stocké

        if (!$clientEmail) {
            return response()->json(['message' => 'Adresse email du client introuvable.'], 400);
        }

        Mail::to($clientEmail)->send(new DevisMail($devis));

        return response()->json([
            'message' => 'Le devis a été envoyé par mail avec succès.',
            'client' => $client
        ], 200);
    }

    // Fonction pour récupérer un devis par ID
    public function getDevisById($id)
    {
        $devis = Devis::findOrFail($id);
        return response()->json($devis, 200);
    }

    // Fonction pour ajouter un produit
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'reference' => 'required|string|max:255|unique:products,reference',
                'label' => 'required|string|max:255',
                'price' => 'required|numeric',
                'selling_price' => 'required|numeric',
                'is_purchasing' => 'nullable|boolean',
                'description' => 'nullable|string',
                'public_url' => 'nullable|url',
                'product_type' => 'nullable|string|max:100',
                'weight' => 'nullable|numeric|min:0',
                'dimensions' => 'nullable|array',
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
                'tags' => 'nullable|array',
                'min_selling_price' => 'nullable|numeric|min:0',
                'tax_rate' => 'nullable|numeric|min:0|max:100',
            ]);
    
            $product = Product::create($validatedData);
    
            return response()->json([
                'message' => 'Produit ajouté avec succès',
                'product' => $product
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        }
    }
    
    // Méthode pour rechercher des produits
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

    // Fonction pour stocker un devis
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

    public function getProduct($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }

        return response()->json($product);
    }
}
