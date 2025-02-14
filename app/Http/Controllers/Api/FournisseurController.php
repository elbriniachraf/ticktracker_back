<?php

namespace App\Http\Controllers\Api;

use App\Models\Fournisseur;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FournisseurController extends Controller
{
    // Fonction pour récupérer les fournisseurs
    public function index(Request $request)
    {
        $query = Fournisseur::query();

        // Pagination
        $pageSize = $request->get('pageSize', 10);
    
        // Filtrage par type
        if ($request->has('type')) {
            $query->where('type', $request->get('type'));
        }
    
        // Filtrage par recherche (query)
        if ($request->has('query')) {
            $search = $request->get('query');
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%$search%")
                  ->orWhere('prenom', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%")
                  ->orWhere('telephone', 'like', "%$search%")
                  ->orWhere('adresse', 'like', "%$search%")
                  ->orWhere('code_postal', 'like', "%$search%")
                  ->orWhere('ville', 'like', "%$search%")
                  ->orWhere('pays', 'like', "%$search%")
                  ->orWhere('num_siret', 'like', "%$search%")
                  ->orWhere('code_ape', 'like', "%$search%");
            });
        }
    
        // Pagination et résultats
        $fournisseurs = $query->paginate($pageSize);
    
        return response()->json($fournisseurs);
    }

    // Fonction pour supprimer un fournisseur
    public function destroy(Request $request)
    {
        $id = $request->input('id');
        // Trouver le fournisseur par son ID
        $fournisseur = Fournisseur::find($id);

        if (!$fournisseur) {
            return response()->json(['message' => 'Fournisseur non trouvé.'], 404);
        }

        // Supprimer le fournisseur
        $fournisseur->delete();

        return response()->json(['message' => 'Fournisseur supprimé avec succès.'], 200);
    }

    // Fonction pour ajouter un fournisseur
    public function store(Request $request)
    {
        // Validation des données
        $validatedData = $request->validate([
            'identifiant' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:fournisseurs,email',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:15',
            'adresse' => 'required|string|max:255',
            'code_postal' => 'required|string|max:10',
            'ville' => 'required|string|max:100',
            'pays' => 'required|string|max:100',
            'num_siret' => 'required|string|max:14',
            'code_ape' => 'required|string|max:9',
            'iban' => 'required|string|max:34',
            'bic' => 'nullable|string|max:11', // Code BIC du fournisseur
            'type' => 'required|string|max:100',
            'date_creation' => 'required|date',
            'date_derniere_mise_a_jour' => 'nullable|date',
            'contact_principal' => 'nullable|string|max:255',
            'site_web' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:100',
            'categorie' => 'nullable|string|max:100',
            'conditions_paiement' => 'nullable|string|max:255',
            'devise' => 'nullable|string|max:10',
            'statut' => 'required|string|max:20',
            'pref_contact' => 'nullable|string|max:50',
            'logo' => 'nullable|string', // URL ou base64 du logo
            'notes' => 'nullable|string|max:255',
        ]);

        // Création du fournisseur
        $fournisseur = Fournisseur::create($validatedData);

        return response()->json([
            'message' => 'Fournisseur ajouté avec succès',
            'fournisseur' => $fournisseur
        ], 201);
    }
}
