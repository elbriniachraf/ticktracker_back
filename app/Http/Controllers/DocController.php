<?php

namespace App\Http\Controllers;

use App\Models\Doc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocController extends Controller
{
    public function upload(Request $request)
    {
        try {
            // Validation du fichier
            $request->validate([
                'file' => 'required|file',
                'directory' => 'nullable|string',
                'owner' => 'required|string',
                'user_id' => 'required|string',
            ]);
    
            // Récupérer le fichier du formulaire
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
    
            // Vérifier si un fichier avec le même nom existe déjà pour cet utilisateur dans le même répertoire
            $existingDoc = Doc::where('name', $fileName)
                              ->where('user_id', $request->input('user_id'))
                              ->where('directory', $request->input('directory'))
                              ->first();
    
            if ($existingDoc) {
                // Si un fichier avec le même nom existe, retourner une réponse d'erreur
                return response()->json([
                    'message' => 'A file with the same name already exists',
                ], 400);
            }
    
            // Stocker le fichier dans le répertoire 'uploads'
            $path = $file->store('uploads');
    
            // Créer un document dans la base de données
            $doc = Doc::create([
                'user_id' => $request->input('user_id'),
                'name' => $fileName,
                'url' => $path,
                'size' => $file->getSize(),
                'extension' => $file->getClientOriginalExtension(),
                'isFolder' => false,
                'directory' => $request->directory,
                'owner' => $request->owner,
                'list_participants' => json_encode([$request->owner]),
                'isCorbeille'=>false
            ]);
    
            // Retourner une réponse JSON avec les informations du document
            return response()->json([
                'message' => 'File uploaded successfully',
                'doc_id' => $doc->id,
                'url' => Storage::url($path),
            ]);
        } catch (\Exception $e) {
            // Gérer l'erreur et retourner une réponse JSON avec un message d'erreur
            return response()->json([
                'message' => 'File upload failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function storeFolder(Request $request)
    {
        // Validation des champs
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'owner_id' => 'required|string',
            'directory' => 'required|string',
            'is_folder' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Invalid input data'], 400);
        }

        $folderName = $request->input('name');
        $ownerId = $request->input('owner_id');
        $directory = $request->input('directory');

        // Vérification si le dossier existe déjà dans la base de données
        $existingFolder = Doc::where('name', $folderName)
                                ->where('directory', $directory)
                                ->where('owner_id', $ownerId)
                                ->first();

        if ($existingFolder) {
            // Si le dossier existe déjà, renvoyer une réponse appropriée
            return response()->json([
                'status' => 'error',
                'message' => 'Folder already exists',
                'folderName' => $existingFolder->name,
            ], 200);
        }

        // Création d'un nouveau dossier
        $newFolder = Doc::create([
            'name' => $folderName,
            'owner_id' => $ownerId,
            'directory' => $directory,
            'is_folder' => true,
            'size' => 0,
            'nb_files' => 0,
            "isFolder"=>true,
                'isCorbeille'=>false,

            'list_participants' => json_encode([$ownerId]), // Stockage des participants sous forme de tableau JSON
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Folder created successfully',
            'folderName' => $newFolder->name,
        ], 200);
    }


    public function getDocuments(Request $request)
    {
        $directory = $request->input('directory');
        $tab = $request->input('tab');
        $userId = $request->input('userId');
    
        $query = Doc::where('directory', $directory);
    
        switch ($tab) {
            case 'alla':
                // Vérifier si l'utilisateur est dans list_participants en utilisant LIKE
                $documents = $query->where('list_participants', 'like', '%"'.$userId.'"%')
                                   ->where('isCorbeille', false) // Check for non-trashed documents
                                   ->get();
                break;
    
            case 'moi':
                $documents = $query->where('user_id', $userId)
                                   ->where('isCorbeille', false) // Check for non-trashed documents
                                   ->get();
                break;
    
            case 'partage':
                // Vérifier que l'utilisateur est dans list_participants mais qu'il n'est pas le propriétaire
                $documents = $query->where('list_participants', 'like', '%"'.$userId.'"%')
                                   ->where('user_id', '!=', $userId)
                                   ->where('isCorbeille', false) // Check for non-trashed documents
                                   ->get();
                break;
    
            case 'corbeille':
                $documents = $query->where('isCorbeille', true) // Check for trashed documents
                                   ->get();
                break;
    
            default:
                $documents = $query->where('isCorbeille', false)->get();
                break;
        }
    
        return response()->json($documents);
    }
    


    public function moveToTrash($id, Request $request)
    {
        try {
            $file = Doc::findOrFail($id);
            $file->isCorbeille = true;
            $file->save();

            return response()->json(['message' => 'File moved to trash successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error moving file to trash'], 500);
        }
    }
    

}
