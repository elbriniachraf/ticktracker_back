<?php

namespace App\Http\Controllers;

use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Room;
use App\Models\User;


class VideoSdkController extends Controller
{
    public function generateToken()
    {
        $apiKey = 'd01daaf1-b513-4276-ba4c-42118f4a5b75'; // Remplacez par votre clé API Video SDK
        $secretKey = 'c60db8c3d6a268f62a0cbe8a1cceb47bd03d4069a65676fa7d3547f825b1b3c7'; // Remplacez par votre clé secrète

        $payload = [
            'apikey' => $apiKey,
            'exp' => time() + 3600, // Expiration du token dans 1 heure
            'role' => 'host', // Rôle de l'utilisateur
        ];

        $jwt = JWT::encode($payload, $secretKey, 'HS256');

        return $jwt;
    }


    public function getRoomHistory($id)
    {
        $userId = $id;

        // Validate the user_id
        if (!$userId) {
            return response()->json(['error' => 'User ID is required'], 400);
        }

        // Fetch the rooms for the specified user
        $rooms = Room::where('user_id', $userId)
            ->get();

        // Fetch user information for the users associated with each room
        $roomDetails = $rooms->map(function ($room) {
            $sender = User::find($room->sender_id);
            $creator = User::find($room->creator_id);

            return [
                'room' => $room,
                'sender' => $sender,
                'creator' => $creator,
            ];
        });

        return response()->json($roomDetails);
    }
    public function createRoom(Request $request)
    {
        // Générer un token
        $token = $this->generateToken();
        

        $room = Room::create([
            'room_id' => $validatedData['room_id'],
            'name' => $validatedData['name'],
            'type' => $validatedData['type'],
            'participants' => json_encode($validatedData['participants']), // Convertir en JSON pour stocker
            'creator_id' => $validatedData['creator_id'],
        ]);

        // Faire la requête pour créer une salle sur Video SDK
        $response = Http::withHeaders([
            'Authorization' => $token,
            'Content-Type' => 'application/json',
        ])->post('https://api.videosdk.live/v2/rooms', [
            'name' => 'Appel Vidéo Room',
        ]);

        if ($response->successful()) {
            // Récupérer l'identifiant de la salle
            $roomId = $response->json()['roomId'];

            // Envoyer une notification (via WebSocket, Push Notification ou Firebase) à l'autre utilisateur pour qu'il rejoigne l'appel
            // Dans ce cas, vous pouvez envoyer $roomId et notifier l'utilisateur de l'appel entrant

            return response()->json(['roomId' => $roomId], 200);
        } else {
            return response()->json(['error' => 'Erreur lors de la création de la salle'], 500);
        }
    }
}
