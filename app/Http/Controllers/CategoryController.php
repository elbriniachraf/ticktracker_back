<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Ajouter une nouvelle catégorie
  
   public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string|max:500',
    ]);

    // Création de la catégorie avec des valeurs par défaut
    $category = Category::create([
        'name' => $validated['name'],
        'description' => $validated['description'] ?? null,
        'slug' => strtolower(str_replace(' ', '-', $validated['name'])), // Génération automatique du slug
        'status' => 'active', // Valeur par défaut pour éviter une erreur
    ]);

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
    // Récupérer l'ID de la catégorie à supprimer
    $id = $request->input('id');

    // Trouver la catégorie par son ID
    $category = Category::find($id);

    if (!$category) {
        return response()->json(['message' => 'Category not found'], 404);
    }

    // Supprimer la catégorie
    $category->delete();

    return response()->json(['message' => 'Category deleted successfully'], 200);
}

 
  
}
