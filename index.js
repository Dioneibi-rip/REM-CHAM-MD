import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import figlet from 'figlet';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);

// --- El arte de Figlet se mantiene igual ---
figlet.text('REM CHAM', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
}, function(err, data) {
    if (err) {
        console.log('Algo salió mal con figlet...');
        console.dir(err);
        return;
    }
    console.log(chalk.cyanBright(data));
});

let isRunning = false;

async function start(file) {
    if (isRunning) return;
    isRunning = true;

    const args = [join(__dirname, file), ...process.argv.slice(2)];

    setupMaster({
        exec: args[0],
        args: args.slice(1),
        // Le damos al proceso hijo acceso a la terminal estándar para que pueda interactuar contigo
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'], 
    });

    let p = fork();

    // El manejador de mensajes ahora es más simple. Solo para funciones especiales.
    p.on('message', data => {
        // Ya no imprimimos cada mensaje recibido para no causar confusión
        switch (data) {
            case 'reset':
                console.log(chalk.yellow('>> Reiniciando el bot...'));
                p.process.kill();
                isRunning = false;
                start(file);
                break;
            case 'uptime':
                p.send(process.uptime());
                break;
        }
    });

    p.on('exit', (code) => {
        isRunning = false;
        console.error(chalk.red(`❌ Proceso terminado con código: ${code}`));
        
        if (code === 0) return; // Si el código es 0, fue una salida limpia, no reiniciar.

        console.log(chalk.green('>> Intentando reiniciar...'));
        start(file);
        
        watchFile(args[0], () => {
            unwatchFile(args[0]);
            start(file);
        });
    });

    // Se eliminó por completo la interfaz de readline (rl) del script "Gerente".
    // Esto es CRUCIAL. Ahora el proceso hijo (remcham.js) manejará la entrada del usuario.
}

start('remcham.js');