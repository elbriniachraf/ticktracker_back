<?php

namespace App\Http\Controllers;

use App\Models\Relance;
use App\Models\Facture;
use Illuminate\Http\Request;

class RelanceController extends Controller
{
    public function index()
    {
        $relances = Relance::with('facture', 'client')->get();
        return response()->json($relances);
    }

    public function store(Request $request)
    {
        $relance = Relance::create([
            'facture_id' => $request->facture_id,
            'client_id' => $request->client_id,
            'date' => $request->date,
            'status' => 'envoyée',
            'message' => $request->message,
            'amount_due' => $request->amount_due
        ]);
        
        return response()->json($relance);
    }
}
