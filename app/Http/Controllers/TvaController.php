<?php

namespace App\Http\Controllers;

use App\Services\TvaCalculator;
use Illuminate\Http\Request;



class TvaController extends Controller
{
    protected $tvaCalculator;

    public function __construct(TvaCalculator $tvaCalculator)
    {
        $this->tvaCalculator = $tvaCalculator;
    }

    public function calculate(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'type' => 'required|string|in:HT-TTC,TTC-HT',
            'countryCode' => 'required|string'
        ]);

        return response()->json($this->tvaCalculator->calculate(
            $validated['amount'],
            $validated['type'],
            $validated['countryCode']
        ));
    }
}
