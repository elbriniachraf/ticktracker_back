<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $appointment = Appointment::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'lien' => $request->input('lien'),
            'start_date' => $request->input('startDate'),
            'end_date' => $request->input('endDate'),
            'start_time' => $request->input('starttime'),
            'end_time' => $request->input('endTime'),
            'type' => $request->input('type'),
            'user_id' => $request->input('userId'),
            'color' => $request->input('color'),
            'is_draft' => false, // Mark as finalized
            'participants' => $request->input('participants'), // Pass an array of participants
        ]);

        return response()->json($appointment, 201); // Return created appointment with 201 status code
    }

    public function getUserAppointments(Request $request)
    {
        $userId = $request->input('userId');
    
        // Fetch appointments where the user is a participant
        $appointments = Appointment::where('participants', 'like', '%' . $userId . '%')->get();
    
        return response()->json($appointments);
    }
    
}

