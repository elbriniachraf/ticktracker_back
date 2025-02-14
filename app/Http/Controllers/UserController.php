<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{
    public function updateImage(Request $request) {
        $user = User::find($request->id);
    
        // Vérification si l'image est en base64
        if ($request->has('profile_image')) {
            // Décoder l'image base64
            $imageData = $request->input('profile_image');
            $imageName = time() . '.png'; // Générer un nom unique pour l'image
            $imagePath = public_path('profile_images/' . $imageName);
    
            // Assurez-vous que le répertoire existe
            if (!file_exists(public_path('profile_images'))) {
                mkdir(public_path('profile_images'), 0755, true);
            }
    
            // Sauvegarder l'image décodée
            file_put_contents($imagePath, base64_decode($imageData));
    
            // Mettre à jour l'image de l'utilisateur
            $user->profile_image = 'profile_images/' . $imageName;
            $user->save();
    
            return response()->json(['profile_image' => asset('profile_images/' . $imageName)]);
        }
    
        return response()->json(['profile_image' => $user->profile_image]);
    }
    
    
    public function updateProfile(Request $request)
    {
        // Valider les données reçues de la requête
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'about_me' => 'nullable|string|max:500',
            'selected_signature' => 'nullable|integer',
            'profile_image' => 'nullable|string', // Vous pouvez gérer ici le type d'image (URL ou base64, etc.)
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }
        $id=$request->input('id');
        // Récupérer l'utilisateur connecté (vous pouvez utiliser Auth si l'utilisateur est authentifié)
        $user =User::findOrFail($id);


        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        // Mettre à jour les informations de l'utilisateur
        $user->first_name = $request->input('first_name');
        $user->last_name = $request->input('last_name');
        $user->about_me = $request->input('about_me');
        $user->selected_signature = $request->input('selected_signature');
        $user->profile_image = $request->input('profile_image');
        $user->save();

        // Répondre avec un message de succès
        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'user' => $user
        ], 200);
    }
    public function getSuggestions(Request $request)
    {
        $email = $request->input('email');

        // Rechercher des utilisateurs dont l'email correspond à celui entré
        $users = User::where('email', 'like', $email . '%')
                     ->take(5)
                     ->get();

        return response()->json($users);
    }
}
