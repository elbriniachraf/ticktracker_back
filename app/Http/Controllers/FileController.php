<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{

    public function view($id)
{
    $file = File::find($id);

    if (!$file) {
        return response()->json(['message' => 'Fichier introuvable'], 404);
    }

    // Vérifier si le chemin du fichier existe et n'est pas null
    if (empty($file->path)) {
        return response()->json(['message' => 'Le fichier n\'a pas de chemin valide.'], 404);
    }

    // Utiliser Storage::path() pour obtenir le chemin absolu du fichier
    $filePath = Storage::path($file->path);

    // Vérifier si le fichier existe réellement à ce chemin
    if (!file_exists($filePath)) {
        return response()->json(['message' => 'Le fichier n\'existe pas'], 404);
    }

    // Utiliser response()->file() pour ouvrir le fichier dans un nouvel onglet
    return response()->file($filePath);
}

public function renameFile(Request $request, $id)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
    ]);

    $file = File::findOrFail($id);
    $file->name = $validated['name'];
    $file->save();

    return response()->json(['message' => 'Fichier renommé avec succès', 'data' => $file]);
}
public function toggleFavorite(Request $request, $id)
{
    $file = File::findOrFail($id);
    $file->is_favorite = $request->input('isFavorite', false); // Récupère l'état
    $file->save();

    return response()->json(['success' => true, 'message' => 'État favori mis à jour', 'file' => $file]);
}

public function createFolder(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'path' => 'nullable|string', // Chemin du dossier parent (optionnel)
    ]);

    // Créer le dossier
    $folder = File::create([
        'name' => $validated['name'],
        'is_folder' => true,
        'extension'=>'Folder',
        'path' => $validated['path'] ?? null,
    ]);

    return response()->json([
        'message' => 'Dossier créé avec succès.',
        'folder' => $folder,
    ], 201);
}
    public function upload(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file', // Limite à 5 Mo
            'name' => 'required|string',
            'extension' => 'required|string',
            'size' => 'required|integer',
            'isFolder' => 'required|string', // Utilisez un type booléen pour les dossiers
        ]);

        // Stocker le fichier sur le serveur
        $filePath = $request->file('file')->store('uploads');

        // Enregistrer les métadonnées dans la base de données
        $file = File::create([
            'name' => $validated['name'],
            'extension' => $validated['extension'],
            'size' => $validated['size'],
            'is_folder' => $validated['isFolder'],
            'path' => $filePath, // Stocker le chemin du fichier
        ]);

        return response()->json([
            'message' => 'Fichier téléchargé avec succès.',
            'file' => $file,
        ]);
    }

    public function getFiles()
    {
        // Récupérer tous les fichiers depuis la base de données
        $files = File::all();

        // Retourner les fichiers en réponse JSON
        return response()->json([
            'files' => $files,
        ]);
    }

    public function delete($id)
    {
        // Trouver le fichier par ID
        $file = File::find($id);
    
        if (!$file) {
            return response()->json(['message' => 'Fichier introuvable.'], 404);
        }
    
        // Marquer le fichier comme "trashed" au lieu de le supprimer
        $file->is_trashed = true;
        $file->save();
    
        return response()->json(['message' => 'Fichier marqué comme supprimé avec succès.']);
    }
    

    public function download($id)
    {
        $file = File::find($id);
    
        if (!$file) {
            return response()->json(['message' => 'Fichier introuvable'], 404);
        }
    
        // Vérifier si le chemin du fichier existe et n'est pas null
        if (empty($file->path)) {


            return response()->json(['','message' => 'Le fichier n\'a pas de chemin valide.'], 404);
        }
    
        // Utiliser Storage::path() pour obtenir le chemin absolu du fichier
        $filePath = Storage::path($file->path);
    
        // Vérifier si le fichier existe réellement à ce chemin
        if (!file_exists($filePath)) {
            return response()->json(['message' => 'Le fichier n\'existe pas'], 404);
        }
    
        // Retourner le fichier pour le téléchargement
        return response()->download($filePath, $file->name);
    }
    
}
