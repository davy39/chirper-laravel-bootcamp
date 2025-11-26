import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    // Détection StackBlitz
    const isStackBlitz = env.APP_URL?.includes('webcontainer.io');

    return {
        server: {
            //host: '0.0.0.0', 
            port: 5173,
            hmr: {
                host: isStackBlitz ? new URL(env.APP_URL).host : undefined,
                clientPort: isStackBlitz ? 443 : undefined,
                protocol: isStackBlitz ? 'wss' : 'ws'
            },
            proxy: {
                // On proxy tout sauf ce que Vite gère (JS/CSS) vers PHP
                '^(?!/@vite|/@id|/node_modules|/resources|/assets|/@react-refresh).*': {
                    target: 'http://localhost:3000',
                    changeOrigin: false,
                    secure: false,
                    xfwd: true
                }
            }
        },
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.js'],
                refresh: true,
            }),
            tailwindcss(),
        ],
    };
});