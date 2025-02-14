<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Invitation;
use App\Models\Friend;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Resources\InvitationResource;

class InvitationController extends Controller
{
    public function index()
    {
        return InvitationResource::collection(Invitation::all());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'sender_id' => 'required|string',
            'receiver_id' => 'required|string',
            'name_sender' => 'required|string|max:255',
            'name_receiver' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
            'is_accepted' => 'required|boolean',
        ]);

        $invitation = Invitation::create($validatedData);

        return new InvitationResource($invitation);
    }

    public function show($id)
    {
        $invitation = Invitation::findOrFail($id);
        return new InvitationResource($invitation);
    }

    public function update(Request $request, $id)
    {
        $invitation = Invitation::findOrFail($id);

        $validatedData = $request->validate([
            'sender_id' => 'string',
            'receiver_id' => 'string',
            'name_sender' => 'string|max:255',
            'name_receiver' => 'string|max:255',
            'content' => 'string',
            'date' => 'date',
            'is_accepted' => 'boolean',
        ]);

        $invitation->update($validatedData);

        return new InvitationResource($invitation);
    }

    public function destroy($id)
    {
        $invitation = Invitation::findOrFail($id);
        $invitation->delete();

        return response()->json(['message' => 'Invitation deleted successfully']);
    }

    public function getSuggestions(Request $request)
    {
        // Valider que l'email est fourni
        $request->validate([
            'email' => 'required|email',
        ]);

        // Récupérer l'email depuis la requête
        $email = $request->input('email');

        // Chercher les utilisateurs dont l'email contient la chaîne saisie
        $users = User::where('email', 'like', '%' . $email . '%')
            ->limit(10) // Limite les résultats pour ne pas surcharger la réponse
            ->get(['id', 'name', 'email', 'avatar_url']);

        // Retourner les utilisateurs en format JSON
        return response()->json($users);
    }

    public function sendInvitation(Request $request)
    {
        try {
            // Validation des entrées
            $request->validate([
                'sender_id' => 'required|string',
                'email' => 'required|email',
            ]);

            $senderId = $request->input('sender_id');
            $email = $request->input('email');

            // Récupération du receiver_id à partir de l'email
            $receiver = User::where('email', $email)->first();

            // Vérifier si l'utilisateur est trouvé
            if (!$receiver) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }

            // Récupération du nom de l'expéditeur
            $sender = User::find($senderId);
            if (!$sender) {
                return response()->json(['message' => 'Expéditeur non trouvé'], 404);
            }

            // Création de l'invitation
            $invitation = new Invitation([
                'sender_id' => $senderId,
                'receiver_id' => $receiver->id,
                'name_sender' => $sender->name,
                'name_receiver' => $receiver->name,
                'content' => 'Invitation',
                'status' => 'sending',
                'date' => now(),
                'is_accepted' => false,
            ]);

            $invitation->save();


            // Retourner une réponse JSON avec les détails de l'invitation
            return response()->json([
                'message' => 'Invitation envoyée avec succès',
                'invitation' => $invitation
            ]);
        } catch (Exception $e) {
            // Capture des exceptions et retour d'une réponse d'erreur

            return response()->json([
                'message' => 'Erreur lors de l\'envoi de l\'invitation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserInvitations($id)
{
    // Chercher les invitations où l'utilisateur est soit l'expéditeur soit le destinataire
    // et où l'invitation n'a pas encore été acceptée
    $invitations = Invitation::where(function($query) use ($id) {
            $query->where('receiver_id', $id);
                 
        })
        ->where('status', 'sending')
        ->get();

    // Retourner les résultats sous forme de JSON
    return response()->json($invitations);
}

protected function areFriends($userId1, $userId2)
{
    return Friend::where(function($query) use ($userId1, $userId2) {
        $query->where('user_id', $userId1)->where('friend_id', $userId2);
    })->orWhere(function($query) use ($userId1, $userId2) {
        $query->where('user_id', $userId2)->where('friend_id', $userId1);
    })->exists();
}
 
    public function accept($id)
    {
        $invitation = Invitation::find($id);

        if (!$invitation) {
            return response()->json(['error' => 'Invitation not found'], 404);
        }

     
        
            $invitation->status = 'accepted';
            $invitation->save();

            // Créer des notifications
            $receiver = User::find($invitation->receiver_id);
            $sender = User::find($invitation->sender_id);


            if (!$this->areFriends($sender->id, $receiver->id)) {
                Friend::create(['user_id' => $sender->id, 'friend_id' => $receiver->id]);
                Friend::create(['user_id' => $receiver->id, 'friend_id' => $sender->id]);
            }

            $this->createNotification($receiver->id, 'Invitation Accepted', "You have accepted the invitation from {$sender->name}.");
            $this->createNotification($sender->id, 'Invitation Accepted', "{$receiver->name} has accepted your invitation.");
           

            return response()->json(['message' => 'Invitation accepted'], 200);
        

    }

    public function decline($id)
    {
        $invitation = Invitation::find($id);

        if (!$invitation) {
            return response()->json(['error' => 'Invitation not found'], 404);
        }

            $invitation->status = 'declined';
            $invitation->save();

            $sender = User::find($invitation->sender_id);

            $receiver = User::find($invitation->receiver_id);

            $this->createNotification($sender->id, 'Invitation Declined', "Your invitation has been declined by {$receiver->name}.");

            return response()->json(['message' => 'Invitation declined'], 200);
        

    }


    protected function createNotification($userId, $type, $message)
    {
        Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'data' => json_encode(['message' => $message]),
        ]);
    }

    public function getNotifications($userId)
    {
        $notifications = Notification::where('user_id', $userId)->get();
        return response()->json($notifications);
    }

}
