<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        Model::unguard();
    }

    public function boot(): void
    {
        // --- FIX URL STACKBLITZ ---
        $url = config('app.url');
        
        // Si l'URL est définie et qu'elle contient 'webcontainer' (StackBlitz)
        if (!empty($url) && str_contains($url, 'webcontainer.io')) {
            URL::forceRootUrl($url);
            URL::forceScheme('https');
        }
        // --------------------------
        
        $this->bootRoute();
    }
    
    public function bootRoute(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}