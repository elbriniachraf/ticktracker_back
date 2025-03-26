<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    // Relation avec les lignes de facture
    public function lines()
    {
        return $this->hasMany(InvoiceLine::class);
    }
}
