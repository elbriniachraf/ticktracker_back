<?php

namespace App\Http\Controllers;
use App\Models\InvoiceTvaHistories;
use Illuminate\Support\Facades\Log;


use Illuminate\Http\Request;

class InvoiceTvaHistoriesController extends Controller
{
    public function store(Request $request) {
        Log::info('Données reçues:', $request->all()); // Ajoute un log
    
        $request->validate([
            'product' => 'required|string',
            'service' => 'nullable|string',
            'price_input' => 'required|numeric',
            'tva_rate' => 'required|numeric',
            'tva_amount' => 'required|numeric',
            'result_price' => 'required|numeric',
            'calculation_mode' => 'required|string'
        ]);
        $invoiceTvaHistory = new InvoiceTvaHistories();
        $invoiceTvaHistory->product = $request->product;
        $invoiceTvaHistory->service = $request->service;
        $invoiceTvaHistory->price_input = $request->price_input;
        $invoiceTvaHistory->tva_rate = $request->tva_rate;
        $invoiceTvaHistory->tva_amount = $request->tva_amount;
        $invoiceTvaHistory->result_price = $request->result_price;
        $invoiceTvaHistory->calculation_mode = $request->calculation_mode;

        // Enregistrer les données dans la table
        $invoiceTvaHistory->save();

    
        return response()->json(['message' => 'Données enregistrées avec succès']);
    }

}
