<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;

Route::inertia('/', 'Login');
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [NoteController::class, 'index'])->name('dashboard');
    Route::get('/notes/create', function () {
        return inertia('NoteEditor', ['note' => null]);
    })->name('notes.create');
    Route::post('/notes', [NoteController::class, 'store'])->name('notes.store');
    // Route::get('/notes/{note}/edit', function ($note) {
    //     return inertia('NoteEditor', ['note' => App\Models\Note::findOrFail($note)]);
    // })->name('notes.edit');
    Route::get('/notes/{note}/edit', [NoteController::class, 'edit'])->name('notes.edit');
    Route::patch('/notes/{note}/edit', [NoteController::class, 'update'])->name('notes.update');
    Route::delete('/notes/{note}', [NoteController::class, 'destroy'])->name('notes.destroy');
    Route::get('/notes/{note}/summarize', [NoteController::class, 'summarize'])->name('notes.summarize');
    Route::post('/notes/{note}/tags', [NoteController::class, 'generateTags'])->name('notes.tags');
});


