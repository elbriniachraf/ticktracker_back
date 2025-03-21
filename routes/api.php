<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('register', [App\Http\Controllers\AuthController::class, 'register']);
Route::post('login', [App\Http\Controllers\AuthController::class, 'login']);
Route::post('reset-password', [App\Http\Controllers\AuthController::class, 'resetPassword']);
Route::get('get-suggestions', [App\Http\Controllers\InvitationController::class, 'getSuggestions']);
Route::get('/user/suggestions', [App\Http\Controllers\UserController::class,  'getSuggestions']);
Route::get('/invitations/{id}', [App\Http\Controllers\InvitationController::class, 'getUserInvitations']);

Route::post('/invitation/send', [App\Http\Controllers\InvitationController::class, 'sendInvitation']);
Route::post('/invitations/{id}/accept', [App\Http\Controllers\InvitationController::class, 'accept'])->name('invitations.accept');
Route::post('/invitations/{id}/decline', [App\Http\Controllers\InvitationController::class, 'decline'])->name('invitations.decline');
Route::get('/notifications/{userId}', [App\Http\Controllers\InvitationController::class, 'getNotifications'])->name('invitations.fetch');
Route::get('/user/{userId}/friends', [App\Http\Controllers\ChatController::class, 'getFriends'])->name('friends.fetch');

Route::post('/messages/send', [App\Http\Controllers\ChatController::class, 'sendMessage'])->name('messages.send');
Route::post('/videoSdk/createRoom', [App\Http\Controllers\VideoSdkController::class, 'createRoom'])->name('messages.createroom');
Route::post('rooms/storeRoom', [App\Http\Controllers\RoomController::class, 'store']); 

Route::post('/appointments', [App\Http\Controllers\AppointmentController::class, 'store']);
Route::get('/appointments', [App\Http\Controllers\AppointmentController::class, 'getUserAppointments']);
Route::post('/upload', [App\Http\Controllers\DocController::class, 'upload']);
Route::post('/getDocuments', [App\Http\Controllers\DocController::class, 'getDocuments']);
Route::post('/save-folder', [App\Http\Controllers\DocController::class, 'storeFolder']);
Route::get('/user/{userId}/histories', [App\Http\Controllers\VideoSdkController::class, 'getRoomHistory']);
Route::post('/update-profile', [App\Http\Controllers\UserController::class, 'updateProfile']);
Route::post('/update-profile-image', [App\Http\Controllers\UserController::class, 'updateImage']);
Route::post('/insert-image', [App\Http\Controllers\ChatController::class, 'sendMessageImage']);

Route::get('/clients', [App\Http\Controllers\Api\ClientController::class, 'index']);

Route::post('/clients/delete', [App\Http\Controllers\Api\ClientController::class, 'destroy'])->name('clients.delete');

Route::post('/clients', [App\Http\Controllers\Api\ClientController::class, 'store']);

Route::get('/fournisseurs', [App\Http\Controllers\Api\FournisseurController::class, 'index']);
Route::post('/fournisseurs/delete', [App\Http\Controllers\Api\FournisseurController::class, 'destroy'])->name('founrisseurs.delete');
Route::post('/fournisseurs', [App\Http\Controllers\Api\FournisseurController::class, 'store']);


Route::get('/prospects', [App\Http\Controllers\ProspectController::class, 'index']);
Route::post('/prospects/delete', [App\Http\Controllers\ProspectController::class, 'destroy'])->name('prospects.delete');
Route::post('/prospects', [App\Http\Controllers\ProspectController::class, 'store']);


Route::get('/contacts', [App\Http\Controllers\ContactController::class, 'index']);
Route::post('/contacts/delete', [App\Http\Controllers\ContactController::class, 'destroy'])->name('contacts.delete');
Route::post('/contacts', [App\Http\Controllers\ContactController::class, 'store']);



Route::get('/products', [App\Http\Controllers\ProductController::class, 'index']);
Route::post('/products/delete', [App\Http\Controllers\ProductController::class, 'destroy'])->name('products.delete');
Route::post('/products', [App\Http\Controllers\ProductController::class, 'store']);
Route::get('/products/{id}', [App\Http\Controllers\ProductController::class, 'getProduct'])->name('products.show'); // Récupérer un produit par ID


Route::get('/categories', [App\Http\Controllers\CategoryController::class, 'index']);
Route::post('/categories/delete', [App\Http\Controllers\CategoryController::class, 'destroy'])->name('categories.delete');
Route::post('/categories', [App\Http\Controllers\CategoryController::class, 'store']);
Route::get('/searchclients', [App\Http\Controllers\Api\ClientController::class, 'searchClients']);
// routes/api.php
Route::post('/devis', [App\Http\Controllers\ProductController::class, 'storeDevis']);
Route::get('/devis', [App\Http\Controllers\ProductController::class, 'indexDevis']);


Route::post('/devis/{id}/update', [App\Http\Controllers\ProductController::class,  'mettreAJourDevis']);
Route::post('/devis/{id}/envoyer-mail', [App\Http\Controllers\ProductController::class,  'envoyerParMail']);
Route::get('/devis/{id}', [App\Http\Controllers\ProductController::class,  'getDevisById']);

Route::get('/factures', [App\Http\Controllers\FactureController::class, 'index']);
Route::post('/factures', [App\Http\Controllers\FactureController::class, 'store']);
Route::get('/factures/{id}', [App\Http\Controllers\FactureController::class, 'show']);
Route::put('/factures/{id}', [App\Http\Controllers\FactureController::class, 'update']);
Route::delete('/factures/{id}', [App\Http\Controllers\FactureController::class, 'destroy']);




Route::get('/avoirs', [App\Http\Controllers\AvoirController::class, 'index']);
Route::post('/avoirs', [App\Http\Controllers\AvoirController::class, 'store']);

Route::get('/searchproducts', [App\Http\Controllers\ProductController::class, 'searchProducts']);

Route::get('/services', [App\Http\Controllers\ServiceController::class, 'index']);
Route::post('/services/delete', [App\Http\Controllers\ServiceController::class, 'destroy'])->name('services.delete');
Route::post('/services', [App\Http\Controllers\ServiceController::class, 'store']);



Route::get('/events', [App\Http\Controllers\CalendarEventController::class, 'index']); // Récupérer les événements
Route::post('/events', [App\Http\Controllers\CalendarEventController::class, 'store']); // Ajouter un événement
Route::put('/events/{id}', [App\Http\Controllers\CalendarEventController::class, 'update']); // Mettre à jour un événement
Route::delete('/events/{id}', [App\Http\Controllers\CalendarEventController::class, 'destroy']); // Supprimer un événemen
Route::post('/files/add-folder', [App\Http\Controllers\FileController::class, 'createFolder']);

Route::post('/files/upload', [App\Http\Controllers\FileController::class, 'upload']);
Route::get('/files', [App\Http\Controllers\FileController::class, 'getFiles']);
Route::delete('/files/{id}', [App\Http\Controllers\FileController::class, 'delete'])->name('files.delete');

Route::get('/files/download/{id}', [App\Http\Controllers\FileController::class, 'download']);
Route::put('/files/rename/{id}', [App\Http\Controllers\FileController::class, 'renameFile']);

Route::put('/files/favorite/{id}', [App\Http\Controllers\FileController::class, 'toggleFavorite']);
