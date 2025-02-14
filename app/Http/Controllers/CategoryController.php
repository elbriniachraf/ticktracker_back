<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Ajouter une nouvelle catégorie
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Catégorie ajoutée avec succès', 'category' => $category], 201);
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
