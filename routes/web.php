<?php

use App\Http\Controllers\ConfiguratorController;
use App\Http\Controllers\Bitrix24Controller;
use App\Http\Controllers\PDFController;
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

Route::middleware('auth')->group(function () {
    Route::get('configurator', [ConfiguratorController::class, 'index'])->name('configurator');
    Route::get('configurator/apartment', [ConfiguratorController::class, 'apartment'])->name('configurator.apartment');
    Route::get('configurator/termo', [ConfiguratorController::class, 'termo'])->name('configurator.termo');
    Route::get('configurator/termo/modular', [ConfiguratorController::class, 'termoModular'])->name('configurator.termo.modular');

    Route::post('pdf/generate', [PDFController::class, 'generate'])->name('pdf.generate');
});

Route::post('/bitrix24/lead', [Bitrix24Controller::class, 'lead'])->name('bitrix24.lead');

require __DIR__.'/settings.php';