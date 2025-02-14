<?php
namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\Message;
use Illuminate\Http\Request;
use App\Events\MessageSent;


class ChatController extends Controller
{
    /**
     * Récupérer les amis d'un utilisateur
     *
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessageImage(Request $request)
    {
        $request->validate([
            'senderId' => 'required',
            'receiverId' => 'required',
            'message' => 'required_if:type,text',
            'type' => 'required|in:text,file',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf', // Modifier selon vos besoins
        ]);
    
        $fileUrl = null;
    
        if ($request->hasFile('file')) {
            // Enregistrer le fichier
            $file = $request->file('file');
            $filePath = $file->store('uploads', 'public'); // Stockage dans le répertoire public
            $fileUrl = asset("storage/$filePath"); // Créer l'URL du fichier
        }
    
        // Sauvegarde du message dans la base de données
        // ...
    
        return response()->json(['message' => 'Message envoyé avec succès', 'file_url' => $fileUrl], 200);
    }
    

     public function sendMessage(Request $request)
{

    $validated = $request->validate([
        'senderId' => 'required|string',
        'receiverId' => 'required|string',
        'message' => 'required|string',
    ]);

    $message=Message::create([
        'sender_id' => $validated['senderId'],
        'receiver_id' => $validated['receiverId'],
        'message' => $validated['message'],
    ]);

    // broadcast(new MessageSent($message));

    return response()->json($message);
}
    public function getFriends($userId)
    {
        // Récupérer les amis où l'utilisateur est soit l'utilisateur soit l'ami
        $friends = Friend::where('user_id', $userId)
        

            ->with('user', 'friend') // Charger les relations utilisateur et ami
            ->get();
            $message = Message::create([
                'chat_id' => "1",
                'user_id' => "sssssssssssss",
                'content' => "ddddddddd",
            ]);
        
    broadcast(new MessageSent($message));

        // Formatter la liste des amis
        $friendList = $friends->map(function ($friend) use ($userId) {
            return $friend->user_id == $userId ? $friend->friend : $friend->user;
        });

        // Retourner la liste sous forme de JSON
        return response()->json($friendList);
    }
}
