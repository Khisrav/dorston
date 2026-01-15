<?php

use App\Http\Controllers\ConfiguratorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/test', function () {
    return Inertia::render('Test');
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('configurator', [ConfiguratorController::class, 'index'])->name('configurator');

require __DIR__.'/settings.php';