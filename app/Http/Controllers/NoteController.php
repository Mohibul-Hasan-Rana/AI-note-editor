<?php

namespace App\Http\Controllers;

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
}
