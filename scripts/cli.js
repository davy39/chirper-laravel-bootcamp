import { PHP } from '@php-wasm/universal';
import { createNodeFsMountHandler, loadNodeRuntime } from '@php-wasm/node';

(async () => {
    try {
        const runtime = await loadNodeRuntime('8.4');
        const php = new PHP(runtime);
        
        php.onStdout = (c) => process.stdout.write(new TextDecoder().decode(c));
        php.onStderr = (c) => process.stderr.write(new TextDecoder().decode(c));

        const cwd = process.cwd();
        await php.mount(cwd, createNodeFsMountHandler(cwd));
        await php.chdir(cwd);
        
        const args = process.argv.slice(2);
        console.log(`🐘 Artisan: php ${args.join(' ')}`);
        
        const response = await php.cli(['php', ...args]);
        
        const code = await response.exitCode;
        
        process.exit(code);

    } catch (e) {
        console.error("❌ Erreur CLI Node:", e);
        process.exit(1);
    }
})();