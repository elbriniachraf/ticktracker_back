<?php
namespace App\Http\Controllers;

use App\Models\TvaRate;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TvaRateController extends Controller
{
    public function index(Request $request)
    {
        return TvaRate::when($request->has('country_code'), fn($q) => $q->byCountry($request->country_code))
            ->paginate(10);
    }

    public function store(Request $request)
{
    // Validation des données
    $request->validate([
        'country_code' => 'required|string|max:255',
        'label' => 'required|string|max:255',
        'rate' => 'required|numeric',
        'valid_from' => 'required|date',
        'valid_to' => 'required|date',
    ]);
    
    // Création du taux de TVA
    $tvaRate = TvaRate::create([
        'country_code' => $request->country_code,
        'label' => $request->label,
        'rate' => $request->rate,
        'valid_from' => $request->valid_from,
        'valid_to' => $request->valid_to,
    ]);

    // Réponse en cas de succès
    return response()->json($tvaRate, 201);
}

public function show($id)
{
    $tva = TvaRate::find($id);
    if ($tva) {
        return response()->json($tva);
    }
    return response()->json(['message' => 'TVA not found'], 404);
}

public function update(Request $request, $id)
{
    // Valider les données reçues
    $validated = $request->validate([
        'country_code' => 'required|string',
        'label' => 'required|string',
        'rate' => 'required|numeric',
        'category' => 'required|string',
        'is_active' => 'required|boolean',
        'valid_from' => 'required|date',
        'valid_to' => 'nullable|date',
    ]);

    // Trouver la TVA par ID
    $tva = TvaRate::find($id);

    if (!$tva) {
        return response()->json(['message' => 'TVA not found'], 404);
    }

    // Mettre à jour les informations
    $tva->update($validated);

    // Retourner la réponse avec les nouvelles données
    return response()->json(['message' => 'TVA updated successfully', 'data' => $tva]);
}


    public function destroy($id)
{
    try {
        $tvaRate = TvaRate::findOrFail($id);
        $tvaRate->delete();
        return response()->json(['message' => 'TVA supprimée avec succès'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Erreur interne du serveur'], 500);
    }
}


}
