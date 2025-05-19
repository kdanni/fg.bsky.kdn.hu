import { runAlgo } from './algo/kdanni-Photo.mjs';

let commandString = '';
if (process.argv.length > 2) {
    for (let i = 2; i < process.argv.length; i++) {
        commandString += `${process.argv[i]} `;
    }
    commandString = commandString.trim();
}

if (/^no[- ]operation\b/.test(commandString)) {
    process.exit(0);
} else if (/^db[- ]?install\b/.test(commandString)) {
    dbinstall();
} else if (/^backfill$/.test(commandString)) {
    backfill();
} else if (/^backfill[- ]?kdanni\b/.test(commandString)) {
    backfillKdanni();
} else if (/^kdanni[- ]?bud\b/i.test(commandString)) {
    kdanniBud();
}  else if (/^kdanni[- ]?photo\b/i.test(commandString)) {
    kdanniPhoto();
}  else if (/^run[- ]?algos?\b/i.test(commandString)) {
    runAlgos();
} else {
    main();
}

async function backfill() {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    await import('./main/backfill.mjs');
}

async function runAlgos() {
    
    await import('./algo/kdanni-Bud.mjs');
    let { runAlgo:bud } = await import('./algo/kdanni-Bud.mjs');
    await bud();

    await import('./algo/kdanni-Photo.mjs');
    let {runAlgo:photo}  = await import('./algo/kdanni-Photo.mjs');
    await photo();

    process.emit('exit_event');
}


async function kdanniPhoto() {
    await import('./algo/kdanni-Photo.mjs');
    const { runAlgo } = await import('./algo/kdanni-Photo.mjs');
    await runAlgo();

    process.emit('exit_event');
}

async function kdanniBud() {
    await import('./algo/kdanni-Bud.mjs');
    const { runAlgo } = await import('./algo/kdanni-Bud.mjs');
    await runAlgo();

    process.emit('exit_event');
}

async function backfillKdanni() {
    await import('./backfill/backfill-publisher.mjs');
    const { backfillPublisher } = await import('./backfill/backfill-publisher.mjs');
    await backfillPublisher();

    process.emit('exit_event');
}


async function dbinstall() {
    await import('./db-install/db-install.mjs');
}

async function main() {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    await import('./main/main.mjs');
}