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
} else if (/^refill[- ]?nsfw\b/.test(commandString)) {
    refill();
} else if (/^refill$/.test(commandString)) {
    refill();
} else if (/jetstream/.test(commandString)) {
    jetstream();
} else if (/^backfill[- ]?kdanni\b/.test(commandString)) {
    backfillKdanni();
} else if (/^backfill[- ]?followed\b/.test(commandString)) {
    backfillFollowed();
} else if (/^backfill[- ]?list(ed)?\b/.test(commandString)) {
    backfillListed();
} else if (/^backfill[- ]?actor\b/.test(commandString)) {
    backfillActor();
} else if (/^backfill[- ]?search$/.test(commandString)) {
    backfillSearchRunner();
} else if (/^backfill[- ]?search\b/.test(commandString)) {
    backfillSearch();
} else if (/^backfill[- ]?favorites?\b/.test(commandString)) {
    backfillFavorites();
}  else if (/^algo[- ]?followed\b/.test(commandString)) {
    algoFollowed();
} else if (/^post[- ]?tagging\b/.test(commandString)) {
    postTagging();
} else if (/^list[- ]?Feed[- ]?Generators?\b/i.test(commandString)) {
    listFeedGenerators();
} else if (/^run[- ]?algos?\b/i.test(commandString)) {
    runAlgos();
} else if (/^db[- ]?poc\b/.test(commandString)) {
    dbPOC();
} else if (/^list[- ]?blocked[- ]?users\b/.test(commandString)) {
    listBlockedUsers();
} else if (/^wiki[- ]?search[- ]?query?\b/i.test(commandString)) {
    upsertQuerySearchTerms();
} else if (/^wiki[- ]?custom[- ]?feed\b/i.test(commandString)) {
    upsertCustomFeedLogic();
} else if (/^feedlogic\b/i.test(commandString)) {
    applyCustomFeedLogic();
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
    await import('./main/main-backfill.mjs');
}

async function jetstream() {
    await import('./main/main-jetstream.mjs');
}


async function backfillActor() {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    const actor = await import('./main/backfill-actor.mjs');
    
    await actor.main();
    
    setTimeout(() => { process.emit('exit_event');}, 1000);
}

async function backfillSearch() {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });
    
    const search = await import('./main/backfill-search.mjs');

    await search.main();

    setTimeout(() => { process.emit('exit_event');}, 1000);
}

async function backfillFavorites() {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    const favorites = await import('./main/backfill-favorites.mjs');

    await favorites.main();

    setTimeout(() => { process.emit('exit_event');}, 1000);
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

async function refill() {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    await import('./backfill/refill-nsfw.mjs');
    const { refillSfwScore_FeedPosts, refillSfwScore_BskyPosts } = await import('./backfill/refill-nsfw.mjs');

    // await refillSfwScore_BskyPosts();
    await refillSfwScore_FeedPosts();

    setTimeout(() => { process.emit('exit_event');}, 1000);
}


async function upsertQuerySearchTerms() {    
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    await import('./mediawiki/media-wiki-bot.mjs');
    const { upsertQuerySearchTerms } = await import('./mediawiki/media-wiki-bot.mjs');

    await upsertQuerySearchTerms();

    setTimeout(() => { process.emit('exit_event');}, 1000);
}

async function upsertCustomFeedLogic() {
    await import('./log/event-logger.mjs');
    const emitter = (await import('./event-emitter.mjs')).default;
    emitter.on('main', () => {/* NOP */ });

    await import('./mediawiki/media-wiki-bot.mjs');

    const { upsertQuerySearchTerms } = await import('./mediawiki/media-wiki-bot.mjs');

    await upsertQuerySearchTerms();


    const { upsertCustomFeedLogic } = await import('./mediawiki/media-wiki-bot.mjs');

    await upsertCustomFeedLogic();

    setTimeout(() => { process.emit('exit_event');}, 1000);
}

/** Installer */

async function dbinstall() {
    await import('./db-install/db-install.mjs');
}


/** DEV Commands */

async function applyCustomFeedLogic() {
    await import('./custom-feed/apply-custom-feed-logic.mjs');
    const { applyCustomFeedLogic } = await import('./custom-feed/apply-custom-feed-logic.mjs');
    await applyCustomFeedLogic();

    process.emit('exit_event');
}

async function runAlgos() {
    
    const { backfillSearchAlgoRunner } = await import('./backfill/backfill-search.mjs');

    await backfillSearchAlgoRunner();

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

async function postTagging() {
    await import('./backfill/backfill-listed.mjs');
    const { initListedUsers } = await import('./backfill/backfill-listed.mjs');
    await import('./post-process/post-post-tagging.mjs');
    const { updateArtistsMimeTag, updateAiMimeTag } = await import('./post-process/post-post-tagging.mjs');

    await initListedUsers();

    await updateArtistsMimeTag();
    await updateAiMimeTag();

    process.emit('exit_event');
}

async function listBlockedUsers() {
    const match = /^list[- ]?blocked[- ]?users\b(.+)$/.exec(commandString) || ['', '', ''];
    const actor = match[1].trim() || process.env.BACKFILL_AUTHOR_HANDLE || process.env.FEEDGEN_PUBLISHER_DID;

    await import('./backfill/backfill-listed.mjs');
    const { getBlockedUsers } = await import('./backfill/backfill-listed.mjs');
    let blockedUsers = await getBlockedUsers(actor);

    console.log(`[listBlockedUsers] Found ${blockedUsers.length} blocked users for actor: ${actor}`);
    for (const user of blockedUsers || []) {
        console.log(`[listBlockedUsers] User: ${user.did} - ${user.handle} - ${user.displayName}`);
    }

    process.emit('exit_event');
}

async function dbPOC() {
    await import('./db/db-poc.mjs');
    const { runPoc } = await import('./db/db-poc.mjs');
    await runPoc();

    process.emit('exit_event');
}