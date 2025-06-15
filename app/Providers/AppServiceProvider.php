<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Note;
use App\Policies\NotePolicy;

class AppServiceProvider extends ServiceProvider
{

   

    protected $policies = [
        Note::class => NotePolicy::class,
    ];
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
