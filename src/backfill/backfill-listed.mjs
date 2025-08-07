import got from 'got';

import { backfillActor } from './backfill-actor.mjs';
import { runAlgo, shortname } from '../algo/listed.mjs';

import { getInitialFeedData } from '../api/xrpc/getFeedSkeleton/mw/listed.mjs';
import { constructCacheKey } from '../api/xrpc/getFeedSkeleton/000.mjs';
import { isRedisConnected, redisSet } from '../redis/redis-io-connection.mjs';


const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';

const BACKFILL_ACTOR = process.env.BACKFILL_AUTHOR_HANDLE || process.env.FEEDGEN_PUBLISHER_DID;

const DEV_ENV = process.env.ENV === 'DEV';

export async function backfillListed() {
    console.log(`[backfillListed] Starting backfilling lists.`);
    try {
        const listUrls = await getLists(BACKFILL_ACTOR);

        DEV_ENV && console.log(`[backfillListed] Found ${listUrls.length} lists for actor: ${BACKFILL_ACTOR}`, listUrls);

        for (const list of listUrls || []) {
            DEV_ENV && console.log(`[backfillListed] List: ${list.uri} - ${list.name}`);

            let safeForWorkScore = 10;
            if (/NSFW/i.test(`${list.name}`)) {
                safeForWorkScore = 0;
            } else 
            if (/Not Listed/i.test(`${list.name}`)) {
                safeForWorkScore = 5;
            } else 
            if (/^Pol$/i.test(`${list.name}`)) {
                safeForWorkScore = 5;
            }

            const listUsers = await getListedUsers(list.uri);

            DEV_ENV && console.log(`[backfillListed] Found ${listUsers.length} users in list: ${list.uri}`, listUsers);

            for (const user of listUsers || []) {
                DEV_ENV && console.log(`[backfillListed] User: ${user.did} - ${user.handle} - ${user.displayName}`);
                await backfillActor(user.did, safeForWorkScore);
                await runAlgo(user.did, list.name);
            }
        }

        

        if(await isRedisConnected()) {
            let initialFeedData = await getInitialFeedData();
            if (initialFeedData && initialFeedData.feed) {
                let cacheKey = constructCacheKey(shortname);
                await redisSet(cacheKey, JSON.stringify(initialFeedData), ['EX', 3000]); 
                console.log(`[backfillListed] Cached initial feed data for ${cacheKey}`);
            }
        }
    } catch (error) {
        console.error(`[backfillListed] Error: ${error.message}`);
    }
    console.log(`[backfillListed] Finished backfilling lists.`);
}


export async function getLists(actor) {

    const retArray = [];

    if (!actor && `${actor}`.length < 4) {
        return retArray;
    }

    let cursor = null;

    while (cursor !== undefined) {
        let cursorParam = cursor ? `&cursor=${cursor}` : '';

        const url = `${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.graph.getLists?actor=${actor}${cursorParam}`;
        DEV_ENV && console.log(`URL: ${url}`);
        const response = await got(url, {
            headers: {
                'Accept': 'application/json',
            },
            responseType: 'json',
            resolveBodyOnly: true,
            retry: {
                limit: 1,
            },
            timeout: {
                request: 10000,
            },
            hooks: {
                beforeRetry: [
                    (options, error) => {
                        console.error(`[backfillListed] Request failed. Retrying... ${error.message}`);
                    },
                ],
            },
        });

        DEV_ENV && console.log(`[backfillListed] Lists: ${response?.lists.length}`);
        for(const list of response?.lists || []) {
            // console.dir(list, {depth: null});
            retArray.push({uri: list.uri, name: list.name});
        }

        cursor = response.cursor;
        DEV_ENV && console.log('[backfillListed] Cursor:', cursor);
        if (!cursor) {
            break;
        }
    } // while loop END

    return retArray;
}

export async function getListedUsers(listUrl) {

    const retArray = [];

    if (!listUrl && `${listUrl}`.length < 4) {
        return retArray;
    }

    let cursor = null;

    while (cursor !== undefined) {
        let cursorParam = cursor ? `&cursor=${cursor}` : '';

        const url = `${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.graph.getList?list=${listUrl}${cursorParam}`;
        DEV_ENV && console.log(`URL: ${url}`);
        const response = await got(url, {
            headers: {
                'Accept': 'application/json',
            },
            responseType: 'json',
            resolveBodyOnly: true,
            retry: {
                limit: 1,
            },
            timeout: {
                request: 10000,
            },
            hooks: {
                beforeRetry: [
                    (options, error) => {
                        console.error(`[backfillListed] Request failed. Retrying... ${error.message}`);
                    },
                ],
            },
        });


        DEV_ENV && console.log(`[backfillListed] List items: ${response?.items.length}`);
        for(const item of response?.items || []) {
            // console.dir(item, {depth: null});
            retArray.push({ uri: item.uri, did: item.subject?.did, 
                handle: item.subject?.handle, displayName: item.subject?.displayName});
        }

        cursor = response.cursor;
        DEV_ENV && console.log('[backfillListed] Cursor:', cursor);
        if (!cursor) {
            break;
        }
    } // while loop END

    return retArray;
}

export async function getBlockedUsers(actor) {
    const retArray = [];

    if (!actor && `${actor}`.length < 4) {
        return retArray;
    }

    let cursor = null;

    while (cursor !== undefined) {
        let cursorParam = cursor ? `&cursor=${cursor}` : '';

        const url = `${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.graph.getBlocks?actor=${actor}${cursorParam}`;
        DEV_ENV && console.log(`URL: ${url}`);
        const response = await got(url, {
            headers: {
                'Accept': 'application/json',
            },
            responseType: 'json',
            resolveBodyOnly: true,
            retry: {
                limit: 1,
            },
            timeout: {
                request: 10000,
            },
            hooks: {
                beforeRetry: [
                    (options, error) => {
                        console.error(`[backfillListed] Request failed. Retrying... ${error.message}`);
                    },
                ],
            },
        });

        DEV_ENV && console.log(`[backfillListed] Blocked users: ${response?.blocks.length}`);
        for(const block of response?.blocks || []) {
            // console.dir(block, {depth: null});
            retArray.push({uri: block.uri, did: block.subject?.did, 
                handle: block.subject?.handle, displayName: block.subject?.displayName});
        }

        cursor = response.cursor;
        DEV_ENV && console.log('[backfillListed] Cursor:', cursor);
        if (!cursor) {
            break;
        }
    } // while loop END

    return retArray;
}