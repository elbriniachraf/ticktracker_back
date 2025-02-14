<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Récupérer tous les services.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Paginer les services avec la relation 'category'
        $services = Service::with('category')->paginate(10); // 10 services par page, ajustez ce nombre selon vos besoins
    
        return response()->json($services);
    }
    

    /**
     * Ajouter un nouveau service.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validation des données
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'private' => 'required|boolean',
            'duration' => 'required|integer',
            'category_id' => 'required|exists:categories,id', // Vérifier que la catégorie existe
            'status' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'service_provider' => 'nullable|string',
            'location' => 'nullable|string',
            'rating' => 'nullable|numeric|min:1|max:5',
            'features' => 'nullable|array',
            'image_url' => 'nullable|url',
            'is_featured' => 'nullable|boolean',
            'tags' => 'nullable|array',
        ]);

        // Création du service
        $service = Service::create($request->all());

        return response()->json($service, 201); // Retourner la ressource créée
    }

    /**
     * Afficher un service spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $service = Service::with('category')->findOrFail($id); // Inclure la relation catégorie
        return response()->json($service);
    }

    /**
     * Mettre à jour un service existant.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        // Validation des données
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'private' => 'required|boolean',
            'duration' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'status' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'service_provider' => 'nullable|string',
            'location' => 'nullable|string',
            'rating' => 'nullable|numeric|min:1|max:5',
            'features' => 'nullable|array',
            'image_url' => 'nullable|url',
            'is_featured' => 'nullable|boolean',
            'tags' => 'nullable|array',
        ]);

        // Mise à jour du service
        $service->update($request->all());

        return response()->json($service); // Retourner la ressource mise à jour
    }

    /**
     * Supprimer un service.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $service = Service::findOrFail($id);

        // Suppression du service
        $service->delete();

        return response()->json(['message' => 'Service supprimé avec succès']);
    }
}
