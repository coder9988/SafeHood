<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Neighborhood Safety API',
        'status' => 'running',
        'api' => url('/api'),
    ]);
});
