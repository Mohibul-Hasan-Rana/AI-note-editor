<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
     public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();        

        $user = User::updateOrCreate(
            ['google_id' => $googleUser->id],
            [
                'google_id' => $googleUser->id,
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'avatar' => $googleUser->avatar,
            ]
        );

        Auth::login($user);
        return redirect('/dashboard');
    }

    public function logout()
    {
        Auth::logout();
        return redirect('/');
    }
}
