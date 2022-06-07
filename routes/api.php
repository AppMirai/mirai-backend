<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImagesController;
use App\Http\Controllers\AuthApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('register',[AuthApi::class, 'register']);
Route::post('login',[AuthApi::class, 'login']);

Route::apiResource('products', ProductController::class);
Route::post('products/{product}/tambah-gambar', [ProductImagesController::class, 'store']);
Route::post('products/{product}/update-gambar/{productImages}', [ProductImagesController::class, 'update']);
Route::get('products/{product}/delete-gambar/{productImages}', [ProductImagesController::class, 'destroy']);

Route::middleware('auth')->get('/user', function (Request $request) {
    Route::post('logout', [AuthApi::class, 'logout']);
    Route::post('user', function(Request $request) {
        return $request->user();
    });
});
