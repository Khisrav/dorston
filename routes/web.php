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
        // 'canRegister' => Features::enabled(Features::registration()),
        'canRegister' => false,
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('configurator', [ConfiguratorController::class, 'index'])->name('configurator');
    Route::get('configurator/apartment', [ConfiguratorController::class, 'apartment'])->name('configurator.apartment');
    Route::get('configurator/termo', [ConfiguratorController::class, 'termo'])->name('configurator.termo');
    Route::get('configurator/termo/modular', [ConfiguratorController::class, 'termoModular'])->name('configurator.termo.modular');
});

require __DIR__.'/settings.php';