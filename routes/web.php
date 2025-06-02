<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::permanentRedirect('/', '/dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');

    Route::redirect('dashboard', 'projects')->name('dashboard');

    Route::apiResource('projects', ProjectController::class);

    Route::apiResource('tasks', TaskController::class)->only([
        'store',
        'update',
        'destroy',
    ]);

    Route::apiResource('tags', TagController::class)->only([
        'store',
        'update',
        'destroy',
    ]);

    Route::get('/projects/{project}/tags', [
        ProjectController::class,
        'tags',
    ])->name('projects.tags');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
