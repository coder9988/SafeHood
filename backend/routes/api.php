<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\IncidentController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('incidents', IncidentController::class);
    Route::get('/my-incidents', [IncidentController::class, 'mine']);
    Route::apiResource('announcements', AnnouncementController::class)->only(['index', 'store']);
    Route::post('/incidents/{incident}/comments', [CommentController::class, 'store']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);

    Route::get('/admin/stats', [AdminController::class, 'stats']);
    Route::get('/admin/incidents', [AdminController::class, 'incidents']);
    Route::patch('/admin/incidents/{incident}/status', [AdminController::class, 'updateStatus']);
});
