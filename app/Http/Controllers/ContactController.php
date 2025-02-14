<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ContactController extends Controller
{
    // Liste des contacts avec pagination, recherche, et filtres
    public function index(Request $request)
    {
        $query = Contact::query();

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
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        // Pagination et résultats
        $contacts = $query->paginate($pageSize);

        return response()->json($contacts);
    }

    // Ajouter un nouveau contact
    public function store(Request $request)
    {
        // Validation des données
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'telephone' => 'nullable|string|max:15',
            'fonction' => 'nullable|string|max:255',
            'entreprise' => 'nullable|string|max:255',
            'adresse' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:100',
            'pays' => 'nullable|string|max:100',
            'code_postal' => 'nullable|string|max:10',
            'note' => 'nullable|string',
            'type' => 'required|string|max:50',
            'created_by' => 'nullable|exists:users,id',
        ]);

        // Création du contact
        $contact = Contact::create($validatedData);

        return response()->json([
            'message' => 'Contact ajouté avec succès',
            'contact' => $contact
        ], 201);
    }

    // Supprimer un contact
    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json(['message' => 'Contact non trouvé.'], 404);
        }

        $contact->delete();

        return response()->json(['message' => 'Contact supprimé avec succès.'], 200);
    }
}
