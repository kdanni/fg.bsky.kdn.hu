import { upsertQuerySearchTerms, upsertAuthorAlgoLogic } from '../mediawiki/media-wiki-bot.mjs';

import { pool } from './connection/connection.mjs';
import { backfillSearch } from './backfill-search.mjs';

const BACKFILL_SEARCH_QUERIES = [];

// const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const BSKY_SOCIAL_ROOT = process.env.BSKY_SOCIAL_ROOT || 'https://bsky.social';
const LIMIT = process.env.SEARCH_POSTS_LIMIT || 50;
const LOOP_LIMIT = process.env.SEARCH_POSTS_LOOP_LIMIT || 3;
const MINUS_DAYS = process.env.SEARCH_BACKFILL_MINUS_DAYS || 3;


const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

const FIRST_SEARCH_QUERY = process.env.SEARCH_BACKFILL_FIRST_SEARCH_QUERY;


const SEARCH_APP_CREDENTIALS_POOL = process.env.SEARCH_APP_CREDENTIALS_POOL;


export async function backfillSearchPooled() {
    if(!SEARCH_APP_CREDENTIALS_POOL) {
        console.error('[backfillSearchPooled] SEARCH_APP_CREDENTIALS_POOL is not set');
        process.emit('exit_event_1');
        return;
    }
    const credentialsArray = SEARCH_APP_CREDENTIALS_POOL.split(' ').map(cred => {
        const [handle, password] = cred.split(';');
        return { handle, password };
    });
    const searchAppUserDict = {};
    for(const cred of credentialsArray) {
        searchAppUserDict[cred.handle] = {cred : {...cred}, queries: []};
    }
    try {
        await upsertQuerySearchTerms();
        await upsertAuthorAlgoLogic();
    } catch (error) {
        console.error(`[backfillSearch] backfillSearchRunner() upsertQuerySearchTerms ERROR ${error}`)
    }
    if(MINUS_DAYS < 1 || LOOP_LIMIT < 1) {
        console.log(`[backfillSearch] MINUS_DAYS ${MINUS_DAYS} LOOP_LIMIT ${LOOP_LIMIT} - skipping`);
        return;
    }
    const querySearchTerms = await pool.execute('call SP_SELECT_backfill_search_queries()');
    const tmp_BACKFILL_SEARCH_QUERIES = []
    if(querySearchTerms[0] && querySearchTerms[0][0]?.length) {
        tmp_BACKFILL_SEARCH_QUERIES.push(...querySearchTerms[0][0]);
    }
    let foundFirst = FIRST_SEARCH_QUERY ? false : true;
    for(const q of tmp_BACKFILL_SEARCH_QUERIES || []) {
        try {
            if(!foundFirst) {
                if(q.query === FIRST_SEARCH_QUERY) {
                    foundFirst = true;
                } else {
                    console.log(`[backfillSearch] Skipping query: ${q.query}`);
                    continue;
                }
            }
            BACKFILL_SEARCH_QUERIES.push({q: `${q.query}`, sfw: q.sfw});
        } catch (error) {
            console.error(`[backfillSearch] backfillSearchRunner() ERROR ${error}`)
        }
    }
    // from the BACKFILL_SEARCH_QUERIES split the queries evenly into the searchAppUserDict.queries arrays
    let i = 0;
    const keys = Object.keys(searchAppUserDict);
    for(const q of BACKFILL_SEARCH_QUERIES) {
        const key = keys[i % keys.length];
        searchAppUserDict[key].queries.push(q);
        i++;
    }
    // console.log(`[backfillSearchPooled] Starting backfill with ${keys.length} users and ${BACKFILL_SEARCH_QUERIES.length} queries`);
    // console.dir(searchAppUserDict, { depth: null });

    const promises = [];
    for(const key of keys) {
        const confObject = searchAppUserDict[key];
        if(confObject.queries.length) {
            promises.push(doBackfillWithCredsentials(confObject));
        }
    }
    await Promise.all(promises);
    console.log('[backfillSearchPooled] Backfilling by search done.');
}


async function doBackfillWithCredsentials(confObject) {
    console.log(`[backfillSearchPooled] Starting backfill for ${confObject.cred.handle} with ${confObject.queries.length} queries`);

    try {
        for(const query of confObject.queries) {
            await backfillSearch(query.q, query.sfw, confObject.cred.handle, confObject.cred.password);
            await new Promise((resolve) => { setTimeout( resolve , 800 );});
        } 
    } catch (error) {
        console.error(`[backfillSearchPooled] doBackfillWithCredsentials ERROR ${error}`);
    }
}