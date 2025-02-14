<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $jwtKey;

    public function __construct()
    {
        $this->jwtKey = config('jwt.secret_key');
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'companyName' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'legalForm' => 'required|string|min:3',
            'tva' => 'required|string|min:6',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'companyName' => $request->companyName,
            'legalForm' => $request->legalForm,
            'tva' => $request->tva,
            'password' => Hash::make($request->password),
        ]);
    
        $token = JWT::encode(['sub' => $user->id], $this->jwtKey, 'HS256');
    
        return response()->json([
            'token' => $token,
            'user' => $user // Ajout des informations de l'utilisateur dans la réponse
        ]);
    }
    

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
    
        $token = JWT::encode(['sub' => $user->id], $this->jwtKey, 'HS256');
    
        return response()->json([
            'token' => $token,
            'user' => $user // Ajout des informations de l'utilisateur dans la réponse
        ]);
    }
    

    public function resetPassword(Request $request)
    {
        // Ajouter ici la logique pour la réinitialisation du mot de passe
    }

 
}
