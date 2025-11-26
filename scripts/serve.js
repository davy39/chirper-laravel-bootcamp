import express from 'express';
import { PHPRequestHandler, PHP } from '@php-wasm/universal';
import { loadNodeRuntime, createNodeFsMountHandler } from '@php-wasm/node';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000; 
const PUBLIC_ROOT = path.join(process.cwd(), 'public');

// Lecture manuelle du .env
function getEnvValue(key) {
    try {
        const content = fs.readFileSync('.env', 'utf-8');
        const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
        return match ? match[1].trim().replace(/['"]/g, '') : process.env[key];
    } catch (e) { return process.env[key]; }
}

(async () => {
    const handler = new PHPRequestHandler({
        documentRoot: PUBLIC_ROOT,
        getFileNotFoundAction: (path) => ({ type: 'internal-redirect', uri: '/index.php' }),
        phpFactory: async () => {
            const php = new PHP(await loadNodeRuntime('8.4'));
            php.onStdout = (c) => process.stdout.write(new TextDecoder().decode(c));
            php.onStderr = (c) => process.stderr.write(new TextDecoder().decode(c));
            await php.mount(process.cwd(), createNodeFsMountHandler(process.cwd()));
            php.chdir(PUBLIC_ROOT);
            return php;
        }
    });

    await handler.getPrimaryPhp();
    console.log("🐘 Laravel Wasm Engine Ready");

    app.use((req, res, next) => {
        const chunks = [];
        req.on('data', c => chunks.push(c));
        req.on('end', () => { req.rawBody = Buffer.concat(chunks); next(); });
    });

    app.all('*', async (req, res) => {
        try {
            // --- LOGIQUE URL ---
            let rootUrl = getEnvValue('APP_URL');
            
            // Fallback si APP_URL n'est pas défini ou est localhost
            if (!rootUrl || rootUrl.includes('localhost')) {
                // Tentative via Referer (Fix StackBlitz)
                if (req.headers['referer'] && !req.headers['referer'].includes('localhost')) {
                     try {
                        const ref = new URL(req.headers['referer']);
                        rootUrl = `${ref.protocol}//${ref.host}`;
                     } catch(e) {}
                } else {
                    // Fallback standard
                    const host = req.headers['x-forwarded-host'] || req.headers['host'] || `localhost:${PORT}`;
                    const proto = req.headers['x-forwarded-proto'] || 'http';
                    rootUrl = `${proto}://${host}`;
                }
            }
            if (rootUrl.endsWith('/')) rootUrl = rootUrl.slice(0, -1);
            // -------------------

            const result = await handler.request({
                method: req.method,
                url: `${rootUrl}${req.url}`,
                headers: req.headers,
                body: req.rawBody
            });

            const responseHeaders = {};
            let isHtml = false;
            for (const [key, value] of Object.entries(result.headers)) {
                if (key.toLowerCase() === 'content-length') continue;
                if (key.toLowerCase() === 'set-cookie') { responseHeaders[key] = value; continue; }
                const strVal = Array.isArray(value) ? value.join(', ') : value;
                responseHeaders[key] = strVal;
                if (key.toLowerCase() === 'content-type' && strVal.includes('text/html')) isHtml = true;
            }

            res.status(result.httpStatusCode).set(responseHeaders);

            if (isHtml) {
                let html = new TextDecoder().decode(result.bytes);
                html = html.replace('</body>', '<script type="module" src="/@vite/client"></script></body>');
                res.send(html);
            } else {
                res.end(result.bytes);
            }
        } catch (e) { res.status(500).send(e.toString()); }
    });

    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server on http://0.0.0.0:${PORT}`));
})();