<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceTvaHistories extends Model
{
    use HasFactory;

    protected $table = 'invoinc_tva_histories'; // 🔥 Correction : nom correct de la table

    protected $fillable = [
        'product',
        'service',
        'price_input',
        'tva_rate',
        'tva_amount',
        'result_price',
        'calculation_mode',
    ];
}
