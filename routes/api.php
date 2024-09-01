<?php

use App\Http\Controllers\API\V1\AuthController;
use App\Http\Controllers\API\V1\DashboardController;
use App\Http\Controllers\API\V1\SurveyController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::group(['prefix'=>'V1'], function(){
    Route::group(['prefix'=>'auth'], function(){
        Route::post('login', [AuthController::class,'login']);
        Route::post('register', [AuthController::class,'register']);
    });

    Route::middleware('auth:sanctum')->group(function(){
        Route::post('logout', [AuthController::class,'logout']);
        Route::get('user', [AuthController::class,'show']);
        Route::apiResource('survey', SurveyController::class);

        Route::get('/dashboard', [DashboardController::class, 'index']);
    });

    Route::get('/survey/public/{survey:slug}', [SurveyController::class, 'getBySlug']);
    Route::post('/survey/{survey}/answer', [SurveyController::class, 'storeAnswer']);
});
