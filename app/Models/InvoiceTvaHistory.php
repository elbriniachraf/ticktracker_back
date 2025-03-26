<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceTvaHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_line_id', 'old_tva_rate_id', 'new_tva_rate_id', 'old_tva_amount', 'new_tva_amount'
    ];

    public function invoiceLine()
    {
        return $this->belongsTo(InvoiceLine::class);
    }
}
