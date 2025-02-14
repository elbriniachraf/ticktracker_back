<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ClientController extends Controller
{
    // Fonction pour récupérer les clients
    public function index(Request $request)
    {
        $query = Client::query();

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
        $clients = $query->paginate($pageSize);
    
        return response()->json($clients);
    }

    public function searchClients(Request $request)
{
    $query = $request->query('query');

    $clients = Client::where('nom', 'LIKE', "%$query%")->limit(10)->get();

    return response()->json(['data' => $clients]);
}

   public function destroy(Request $request)
   {
   $id= $request->input('id');
       // Trouver le client par son ID
       $client = Client::find($id);

       if (!$client) {
           return response()->json(['message' => 'Client non trouvé.'], 404);
       }

       // Supprimer le client
       $client->delete();

       return response()->json(['message' => 'Client supprimé avec succès.'], 200);
   }


   public function store(Request $request)
   {
       // Validation des données
       $validatedData = $request->validate([
           'nom' => 'required|string|max:255',
           'prenom' => 'required|string|max:255',
           'email' => 'required|email|max:255|unique:clients,email',
           'telephone' => 'required|string|max:15',
           'adresse' => 'required|string|max:255',
           'code_postal' => 'required|string|max:10',
           'ville' => 'required|string|max:100',
           'pays' => 'required|string|max:100',
           'num_siret' => 'required|string|max:14',
           'code_ape' => 'required|string|max:9',
           'iban' => 'required|string|max:34',
           'type' => 'required|string|max:100',
           'profileImage' => 'nullable|string', // Si c'est une URL ou base64
       ]);

       // Création du client
       $client = Client::create($validatedData);

       return response()->json([
           'message' => 'Client ajouté avec succès',
           'client' => $client
       ], 201);
   }
}
