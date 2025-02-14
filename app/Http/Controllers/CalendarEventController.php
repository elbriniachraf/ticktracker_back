<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CalendarEvent;

class CalendarEventController extends Controller
{
    // Récupérer tous les événements
    public function index()
    {
        return response()->json(CalendarEvent::all());
    }

    // Ajouter un nouvel événement
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:start_date',
            'category' => 'required',
            'color' => 'nullable|string',
        ]);

        $event = CalendarEvent::create($validated);
        return response()->json($event, 201);
    }

    // Mettre à jour un événement
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'category' => 'sometimes|in:work,personal,other',
            'color' => 'nullable|string',
        ]);

        $event = CalendarEvent::findOrFail($id);
        $event->update($validated);

        return response()->json($event);
    }

    // Supprimer un événement
    public function destroy($id)
    {
        $event = CalendarEvent::findOrFail($id);
        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
