<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FormController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Auth API Routes
Route::prefix('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->withoutMiddleware(['web']);
    Route::post('/login', [AuthController::class, 'login'])->withoutMiddleware(['web']);
    Route::post('/logout', [AuthController::class, 'logout'])->withoutMiddleware(['web']);
    Route::get('/user', [AuthController::class, 'user'])->withoutMiddleware(['web']);
});

// Form API Routes
Route::prefix('api/forms')->group(function () {
    Route::options('/{any}', function () {
        return response()->json();
    })->where('any', '.*');

    Route::get('/', [FormController::class, 'index']);
    Route::post('/', [FormController::class, 'store'])->withoutMiddleware(['web']);
    Route::get('/{id}', [FormController::class, 'show'])->withoutMiddleware(['web']);
    Route::put('/{id}', [FormController::class, 'update'])->withoutMiddleware(['web']);
    Route::delete('/{id}', [FormController::class, 'destroy'])->withoutMiddleware(['web']);
});
