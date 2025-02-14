<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InvitationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => (string) $this->_id,
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'name_sender' => $this->name_sender,
            'name_receiver' => $this->name_receiver,
            'content' => $this->content,
            'date' => $this->date,
            'status' => $this->status,
            'is_accepted' => $this->is_accepted,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
