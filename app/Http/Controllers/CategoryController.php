<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Ajouter une nouvelle catégorie
  
    public function store(Request $request)
    {
        // Validation des données envoyées depuis le client
        $validated = $request->validate([
            'name' => 'required|string|max:255', // Obligatoire
            'description' => 'nullable|string|max:500', // Facultatif
        ]);
    
        // Création de la catégorie avec les données validées
        $category = Category::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null, // Si description est vide, cela reste null
        ]);
    
        // Retourner la catégorie nouvellement créée
        return response()->json($category, 201);
    }
    
    // Récupérer toutes les catégories
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }


    public function destroy(Request $request)
    {
    $id= $request->input('id');
        // Trouver le client par son ID
        $client = Category::find($id);
 
        if (!$client) {
            return response()->json(['message' => 'Category non trouvé.'], 404);
        }
 
        // Supprimer le client
        $client->delete();
 
        return response()->json(['message' => 'Category supprimé avec succès.'], 200);
    }
 
  
}
