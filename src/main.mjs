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
} else if (/^publish\b/.test(commandString)) {
    publish(commandString);
} else if (/^unpublish\b/.test(commandString)) {
    unpublish(commandString);
} else if (/^republish\b/.test(commandString)) {
    republish(commandString);
} else if (/^backfill[- ]?kdanni\b/.test(commandString)) {
    backfillKdanni();
} else if (/^backfill[- ]?followed\b/.test(commandString)) {
    backfillFollowed();
} else if (/^backfill[- ]?list(ed)?\b/.test(commandString)) {
    backfillListed();
} else if (/^backfill[- ]?actor\b/.test(commandString)) {
    backfillActor(commandString);
} else if (/^backfill[- ]?search$/.test(commandString)) {
    backfillSearchRunner();
} else if (/^backfill[- ]?search\b/.test(commandString)) {
    backfillSearch(commandString);
} else if (/^algo[- ]?followed\b/.test(commandString)) {
    algoFollowed();
} else if (/^kdanni[- ]?bud\b/i.test(commandString)) {
    kdanniBud();
} else if (/^kdanni[- ]?photo\b/i.test(commandString)) {
    kdanniPhoto();
} else if (/^hashtag[- ]?bud\b/i.test(commandString)) {
    hashtagBud();
} else if (/^hashtag[- ]?tractor\b/i.test(commandString)) {
    hashtagTractor();
} else if (/^hashtag[- ]?brutalism\b/i.test(commandString)) {
    hashtagBrutalism();
} else if (/^not[- ]?urban[- ]?ex\b/i.test(commandString)) {
    notUrbanEx();
} else if (/^mus(eum)?[- ]ej/i.test(commandString)) {
    musEj();
} else if (/^list[- ]?Feed[- ]?Generators?\b/i.test(commandString)) {
    listFeedGenerators();
} else if (/^run[- ]?algos?\b/i.test(commandString)) {
    runAlgos();
} else if (/^display[- ]?posts?\b/i.test(commandString)) {
    displayPosts();
} else {
    main();
}


/** Main logic */


async function main() {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    /** 
     * Main server mode.
     * App listening for incoming custom feed queries from BlueSky.
     */
    await import('./main/main.mjs');
}


async function backfill() {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    /**
     * Main data collection logic.
     * Get data from BlueSky and store it in the database.
     * Then algos select posts for the custom feeds.
     * 
     * After run the app will terminates.
     */
    await import('./main/backfill.mjs');
}

async function publish(commandString) {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    await import('./main/publish.mjs');
    const { publish } = await import('./main/publish.mjs');
    
    await publish(commandString);
}

async function unpublish(commandString) {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    await import('./main/publish.mjs');
    const { unpublish } = await import('./main/publish.mjs');

    await unpublish(commandString);
}

async function republish(commandString) {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    await import('./main/publish.mjs');
    const { republish } = await import('./main/publish.mjs');
    
    await republish(commandString);
}


/** Installer */

async function dbinstall() {
    await import('./db-install/db-install.mjs');
}


/** DEV Commands */

async function runAlgos() {
    
    await import('./algo/kdanni-Bud.mjs');
    let { runAlgo:bud } = await import('./algo/kdanni-Bud.mjs');
    await bud();

    await import('./algo/kdanni-Photo.mjs');
    let {runAlgo:photo}  = await import('./algo/kdanni-Photo.mjs');
    await photo();

    await import('./algo/budapest-hashtag.mjs');
    let { runAlgo:budTag } = await import('./algo/budapest-hashtag.mjs');
    await budTag();

    await import('./algo/magyarorszag-hashtag.mjs');
    let { runAlgo:hunTag } = await import('./algo/magyarorszag-hashtag.mjs');
    await hunTag();

    await import('./algo/kdanni-CustomFeed.mjs');
    let { runAlgo:cf } = await import('./algo/kdanni-CustomFeed.mjs');
    await cf();
    
    await import('./algo/tractor-hashtag.mjs');
    let { runAlgo:tractor } = await import('./algo/tractor-hashtag.mjs');
    await tractor();

    process.emit('exit_event');
}

async function backfillActor(commandString) {
    await import('./backfill/backfill-actor.mjs');
    const { backfillActor } = await import('./backfill/backfill-actor.mjs');

    const match = /^backfill[- ]?actor\b +(\S+)/.exec(commandString) || [commandString, null];

    if(match[1] === null) {
        process.emit('exit_event');
    }
    const actor = `${match[1]}`.trim();
    
    await backfillActor(actor);
    
    process.emit('exit_event');
}

async function backfillSearch(commandString) {
    await import('./backfill/backfill-search.mjs');
    const { backfillSearch } = await import('./backfill/backfill-search.mjs');
    
    const match = /^backfill[- ]?search\b +(.+)/.exec(commandString) || [commandString, null];
    
    console.log(`backfillSearch(commandString): ${commandString}`, match);
    if(match[1] === null) {
        process.emit('exit_event');
    }
    const queryString = `${match[1]}`.trim();

    await backfillSearch(queryString);

    process.emit('exit_event');
}

async function backfillSearchRunner() {
    await import('./backfill/backfill-search.mjs');
    const { backfillSearchRunner } = await import('./backfill/backfill-search.mjs');
    
    await backfillSearchRunner();

    process.emit('exit_event');
}

async function backfillFollowed() {
    await import('./backfill/backfill-followed.mjs');
    const { backfillFollowed } = await import('./backfill/backfill-followed.mjs');
    await backfillFollowed();

    process.emit('exit_event');
}


async function algoFollowed() {
    await import('./algo/followed.mjs');
    const { runAlgo } = await import('./algo/followed.mjs');
    await runAlgo();

    process.emit('exit_event');
}

async function backfillListed() {
    await import('./backfill/backfill-listed.mjs');
    const { backfillListed } = await import('./backfill/backfill-listed.mjs');
    await backfillListed();

    process.emit('exit_event');
}




async function backfillKdanni() {
    await import('./backfill/backfill-publisher.mjs');
    const { backfillPublisher } = await import('./backfill/backfill-publisher.mjs');
    await backfillPublisher();

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

async function hashtagBud() {
    await import('./algo/budapest-hashtag.mjs');
    const { runAlgo } = await import('./algo/budapest-hashtag.mjs');
    await runAlgo();

    process.emit('exit_event');
}

async function hashtagTractor() {
    await import('./algo/tractor-hashtag.mjs');
    const { runAlgo } = await import('./algo/tractor-hashtag.mjs');
    await runAlgo();

    process.emit('exit_event');
}

async function hashtagBrutalism() {
    await import('./algo/brutalism-hashtag.mjs');
    const { runAlgo } = await import('./algo/brutalism-hashtag.mjs');
    await runAlgo(); 
    process.emit('exit_event');
}

async function notUrbanEx() {
    await import('./algo/not-urban-ex.mjs');
    const { runAlgo } = await import('./algo/not-urban-ex.mjs');
    await runAlgo();

    process.emit('exit_event');
}


async function musEj() {
    await import('./algo/kdanni-MusEj.mjs');
    const { runAlgo } = await import('./algo/kdanni-MusEj.mjs');
    await runAlgo();

    process.emit('exit_event');
}


async function listFeedGenerators(){
    await import('./bsky-social/repo.listRecords.mjs');
    const { listFeedGenerator } = await import('./bsky-social/repo.listRecords.mjs');

    await listFeedGenerator();

    process.emit('exit_event');
}

async function displayPosts() {
    await import('./post-process/display-posts-stored.mjs');
    const { displayPostsInDb } = await import('./post-process/display-posts-stored.mjs');

    const match = /(\d+)$/.exec(commandString) || ['', (365 * 20)]
    const minusDays = Number.parseInt(match[1]);
    const cursor = new Date();
    cursor.setDate(cursor.getDate() - minusDays);
    // console.log(match, minusDays, cursor);

    await displayPostsInDb(cursor);

    process.emit('exit_event');
}

