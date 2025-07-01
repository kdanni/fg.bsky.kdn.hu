import got from 'got';

import { backfillActor } from './backfill-actor.mjs';
import { runAlgo } from '../algo/listed.mjs';
import { runAlgo as nsfwAlgo } from '../algo/nsfw.mjs';
import emitter from '../event-emitter.mjs';

const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';

const BACKFILL_ACTOR = process.env.BACKFILL_AUTHOR_HANDLE || process.env.FEEDGEN_PUBLISHER_DID;

const DEV_ENV = process.env.ENV === 'DEV';

const NOT_LISTED_URI = [
    'at://did:plc:2ngdwdgfm7sdtdplcx546zdd/app.bsky.graph.list/3lsvkult3jz2p',
    'at://did:plc:2ngdwdgfm7sdtdplcx546zdd/app.bsky.graph.list/3lsvksm7nmk25',
]

const NSFW_LISTED_URI = [
    'at://did:plc:2ngdwdgfm7sdtdplcx546zdd/app.bsky.graph.list/3lsvksm7nmk25',
]

export async function backfillListed() {
    console.log(`[backfillListed] Starting backfilling lists.`);
    try {
        const listUrls = await getLists(BACKFILL_ACTOR);

        DEV_ENV && console.log(`[backfillListed] Found ${listUrls.length} lists for actor: ${BACKFILL_ACTOR}`, listUrls);

        for (const list of listUrls || []) {
            DEV_ENV && console.log(`[backfillListed] List: ${list.uri} - ${list.name}`);

            const listUsers = await getListedUsers(list.uri);

            DEV_ENV && console.log(`[backfillListed] Found ${listUsers.length} users in list: ${list.uri}`, listUsers);

            for (const user of listUsers || []) {
                DEV_ENV && console.log(`[backfillListed] User: ${user.did} - ${user.handle} - ${user.displayName}`);
                await backfillActor(user.did);
                await runAlgo(user.did, list.name);
            }
        }


    } catch (error) {
        console.error(`[backfillListed] Error: ${error.message}`);
    }
    console.log(`[backfillListed] Finished backfilling lists.`);
}

emitter.on('nsfw-list-backfill-event', async (listUrls) => {
    console.log(`[nsfw-list-backfill-event] Received event to backfill NSFW lists.`);
    await backfillNSFW(listUrls);
});

export async function backfillNSFW(listUrls) {
    console.log(`[backfillNSFW] Starting backfilling NSFW lists.`);
    try {
        const listUsers = await getListedUsers(listUrls);

        DEV_ENV && console.log(`[backfillNSFW] Found ${listUsers.length} users in NSFW list: ${listUrls}`, listUsers);

        for (const user of listUsers || []) {
            DEV_ENV && console.log(`[backfillNSFW] User: ${user.did} - ${user.handle} - ${user.displayName}`);
            await backfillActor(user.did);
            await nsfwAlgo(user.did, 'NSFW');
        }
    } catch (error) {
        console.error(`[backfillNSFW] Error: ${error.message}`);
    }
    console.log(`[backfillNSFW] Finished backfilling NSFW lists.`);

}


export async function getLists(actor) {

    const retArray = [];
    const nsfwArray = [];

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
            
            DEV_ENV && console.log(`[backfillListed] Display Name: ${list.name} URI: ${list.uri}`);
            if ((NSFW_LISTED_URI||[]).includes(`${list.uri}`)) {
                DEV_ENV && console.log(`[backfillListed] NSFW list found with URI: ${list.uri} Display Name: ${list.name}`);
                nsfwArray.push(list.uri);
            }
            if ((NOT_LISTED_URI||[]).includes(`${list.uri}`)) {
                DEV_ENV && console.log(`[backfillListed] Skipping list with URI: ${list.uri} Display Name: ${list.name}`);
                continue;
            }

            retArray.push({uri: list.uri, name: list.name});
        }

        cursor = response.cursor;
        DEV_ENV && console.log('[backfillListed] Cursor:', cursor);
        if (!cursor) {
            break;
        }
    } // while loop END

    if (nsfwArray.length > 0) {
        DEV_ENV && console.log(`[backfillListed] Found ${nsfwArray.length} NSFW lists. Backfilling...`);
        emitter.emit('nsfw-list-backfill-event', nsfwArray);
    }

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
