# Adaptation pour StackBlitz

### 1. Préparation Locale (Avant d'envoyer sur StackBlitz)

Contourner l'installation de Composer sur StackBlitz.

1.  **Installez les dépendances** sur votre machine :
    ```bash
    composer install --optimize-autoloader
    ```
2.  **Créez l'archive vendor** :
    ```bash
    tar -czf vendor.tar.gz vendor/
    ```
---

### 2. Création des Scripts d'Infrastructure (`scripts/`)


### 3. Configuration Laravel (`app/Providers/AppServiceProvider.php`)

On applique la logique de forçage d'URL si on détecte l'environnement Cloud.

```php
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
```

---

### 4. Configuration Vite (`vite.config.js`)

---

### 5. Automatisation (scripts de `package.json`)

On ajoute les dépendances nécessaires à l'infrastructure Node et on configure les scripts.

```bash
npm install -D express tar wait-on
```

```json
{
    "private": true,
    "type": "module",
    "scripts": {
        "build": "vite build",
        "postinstall": "node scripts/setup.js",
        "//": "--- STACKBLITZ COMMANDS ---",
        "db:init": "touch database/database.sqlite && node scripts/cli.js artisan migrate:fresh --seed --force",
        "php-server": "node scripts/serve.js",
        "vite-server": "vite",
        "dev": "npm run db:init && concurrently \"npm run php-server\" \"wait-on tcp:3000 && npm run vite-server\""
    },

}
```
---

### 6. Déploiement et Lancement

1.  **Commitez et poussez** tous les fichiers (y compris `vendor.tar.gz`).
2.  Ouvrez le projet dans **StackBlitz**.
3.  L'installation va se lancer.
4.  **Créez le fichier `.env`** sur StackBlitz avec :
    ```ini
    APP_NAME=Chirper
    APP_ENV=local
    APP_KEY=base64:... (votre clé)
    APP_DEBUG=true
    # IMPORTANT : L'URL StackBlitz exacte
    APP_URL=https://votre-projet.local-credentialless.webcontainer.io
    
    DB_CONNECTION=sqlite
    DB_DATABASE=database/database.sqlite
    
    LOG_CHANNEL=stderr
    ```
5.  Lancez `npm run dev`.

La base de données sera créée, peuplée, et l'application devrait être accessible immédiatement.