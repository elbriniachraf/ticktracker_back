<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;

class RoomController extends Controller
{
    /**
     * Enregistrer une salle d'appel vidéo dans la base de données
     */
    public function store(Request $request)
    {
        try {
        // Valider les données de la requête
        $validatedData = $request->validate([
            'room_id' => 'required|string|unique:rooms,room_id', // room_id doit être unique
            'sender_id' => 'required|string',
            'user_id' => 'required|string',
            'type' => 'required|string', // Type de la salle (one-to-one, etc.)
            
        ]);
    
       
            // Enregistrer la salle dans la base de données
            $room = Room::create([
                'room_id' => $validatedData['room_id'],
                'sender_id' => $validatedData['sender_id'],
                'user_id' => $validatedData['user_id'],
                'type' => $validatedData['type'],
                'participants' => json_encode([$validatedData['sender_id'], $validatedData['user_id']]), // Convertir en JSON pour stocker
                'creator_id' => $validatedData['user_id'],
            ]);
    
            return response()->json(['message' => 'Salle créée avec succès', 'room' => $room], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la création de la salle', 'details' => $e->getMessage()], 500);
        }
    }
    
}
