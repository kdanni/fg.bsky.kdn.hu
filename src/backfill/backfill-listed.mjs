import got from 'got';

import { backfillActor } from './backfill-actor.mjs';
import { runAlgo } from '../algo/listed.mjs';

import { listSfwScore } from '../post-process/util.mjs'; 

import { initListedFeedCache, initFollowedOrListedFeedCache } from '../redis/init-cache.mjs';

import { artistListedDictionary, aiListedDictionary, nsfwListedDictionary } from '../post-process/post-post-tagging.mjs';


const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';

const BACKFILL_ACTOR = process.env.BACKFILL_AUTHOR_HANDLE || process.env.FEEDGEN_PUBLISHER_DID;

const DEV_ENV = process.env.ENV === 'DEV';

export async function backfillListed(dry) {
    console.log(`[backfillListed] Starting backfilling lists.`);
    try {
        const listUrls = await getLists(BACKFILL_ACTOR);

        DEV_ENV && console.log(`[backfillListed] Found ${listUrls.length} lists for actor: ${BACKFILL_ACTOR}`, listUrls);

        const listedUserArrayArray = [];

        for (const list of listUrls || []) {
            DEV_ENV && console.log(`[backfillListed] List: ${list.uri} - ${list.name}`);            
            
            const listUsers = await getListedUsers(list.uri);

            DEV_ENV && console.log(`[backfillListed] Found ${listUsers.length} users in list: ${list.uri}`, listUsers);
            
            listedUserArrayArray.push({listUsers, list});
            
            for (const user of listUsers || []) {
                if( !`${list.name}`.startsWith('!') ) {                    
                    if(`${list.name}`.startsWith('NSFW')) {
                        nsfwListedDictionary[`${user.did}`] = true;
                    }                    
                } else {
                    if(`${list.name}`.startsWith('!artist')) {
                        artistListedDictionary[`${user.did}`] = true;
                    }
                    if(`${list.name}`.startsWith('!ai')) {
                        aiListedDictionary[`${user.did}`] = true;
                    }
                    if(`${list.name}`.startsWith('!nsfw')) {
                        nsfwListedDictionary[`${user.did}`] = true;
                    }
                }
            }            
        }
        if(dry !== 'dry') {
            for (const listUsersArray of listedUserArrayArray || []) {
                const {listUsers, list} = listUsersArray;
                for (const user of listUsers || []) {
                    let safeForWorkScore = listSfwScore(list.name);
                    DEV_ENV && console.log(`[backfillListed] User: ${user.did} - ${user.handle} - ${user.displayName}`);
                    if( !`${list.name}`.startsWith('!') ) {                    
                        await backfillActor(user.did, safeForWorkScore);
                        await runAlgo(user.did, list.name);
                    } else {
                        // NOOP
                    }
                }
            }
            await initListedFeedCache();
            await initFollowedOrListedFeedCache();
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