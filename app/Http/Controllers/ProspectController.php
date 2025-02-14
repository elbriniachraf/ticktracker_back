<?php

namespace App\Http\Controllers;

use App\Models\Prospect;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProspectController extends Controller
{
    // Liste des prospects avec pagination, recherche, et filtres
    public function index(Request $request)
    {
        $query = Prospect::query();

        // Pagination
        $pageSize = $request->get('pageSize', 10);

        // Filtrage par état
        if ($request->has('etat')) {
            $query->where('etat', $request->get('etat'));
        }

        // Filtrage par recherche (query)
        if ($request->has('query')) {
            $search = $request->get('query');
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%$search%")
                  ->orWhere('prenom', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        // Pagination et résultats
        $prospects = $query->paginate($pageSize);

        return response()->json($prospects);
    }

    // Ajouter un nouveau prospect
    public function store(Request $request)
    {
        // Validation des données
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:prospects,email',
            'telephone' => 'nullable|string|max:15',
            'adresse' => 'nullable|string|max:255',
            'code_postal' => 'nullable|string|max:10',
            'ville' => 'nullable|string|max:100',
            'pays' => 'nullable|string|max:100',
            'secteur_activite' => 'nullable|string|max:255',
            'interet' => 'nullable|string|max:50',
            'source' => 'nullable|string|max:255',
            'note' => 'nullable|string',
            'etat' => 'required|string|max:50',
        ]);

        // Création du prospect
        $prospect = Prospect::create($validatedData);

        return response()->json([
            'message' => 'Prospect ajouté avec succès',
            'prospect' => $prospect
        ], 201);
    }

    // Supprimer un prospect
    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $prospect = Prospect::find($id);

        if (!$prospect) {
            return response()->json(['message' => 'Prospect non trouvé.'], 404);
        }

        $prospect->delete();

        return response()->json(['message' => 'Prospect supprimé avec succès.'], 200);
    }
}
