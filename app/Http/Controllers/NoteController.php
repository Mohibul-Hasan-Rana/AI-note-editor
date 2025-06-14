<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    public function index()
    {        
        return inertia('Dashboard', [
            'notes' => Auth::user()->notes()->latest()->get()
        ]);
    }

    public function destroy($id)
    {
        $note = Note::findOrFail($id);
        $note->delete();

        $notes = auth()->user()->notes()->latest()->get();

        return Inertia::render('Dashboard', [
            'notes' => $notes,
        ]);
    }
}
