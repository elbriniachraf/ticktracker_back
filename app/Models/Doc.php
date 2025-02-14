<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;


class Doc extends Model
{
    use HasFactory;
    

    // Table associée au modèle (optionnel si la table suit la convention de nommage)
    protected $table = 'docs';
    protected $connection = 'mongodb';

    // Colonnes pouvant être assignées en masse
    protected $fillable = [
        'user_id',
        'name',
        'url',
        'size',
        'extension',
        'isFolder',
        'directory',
        'owner',
        'list_participants',
        'isFolder',
        'isCorbeille'
    ];

    // Cast de la colonne 'list_participants' en tableau
    protected $casts = [
        'list_participants' => 'array',
    ];

    /**
     * Relation avec l'utilisateur (user)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Fonction pour vérifier si le document est un dossier
     */
    public function isFolder()
    {
        return $this->isFolder;
    }

    /**
     * Fonction pour ajouter un participant
     */
    public function addParticipant($participantId)
    {
        $participants = $this->list_participants;
        if (!in_array($participantId, $participants)) {
            $participants[] = $participantId;
            $this->list_participants = $participants;
            $this->save();
        }
    }

    /**
     * Fonction pour retirer un participant
     */
    public function removeParticipant($participantId)
    {
        $participants = $this->list_participants;
        if (in_array($participantId, $participants)) {
            $participants = array_filter($participants, function($id) use ($participantId) {
                return $id != $participantId;
            });
            $this->list_participants = $participants;
            $this->save();
        }
    }
}
