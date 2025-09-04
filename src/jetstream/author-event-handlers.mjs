
import authorDidEmitter from './author-did-event-emitter.mjs';
import { getLists, getListedUsers } from '../backfill/backfill-listed.mjs'

import { upsertPost } from '../post-process/upsert-post.mjs';
import { listSfwScore } from '../post-process/util.mjs';

import { initFollowedFeedCache, initFollowedOrListedFeedCache, initListedFeedCache, initFeedNSFW } from '../redis/init-cache.mjs';
import { runAlgo as algoF } from '../algo/followed.mjs';
import { runAlgo as algoL } from '../algo/listed.mjs';

import got from 'got';

const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const LIMIT = process.env.AUTHOR_FEED_LIMIT || 50;
const LOOP_LIMIT = process.env.AUTHOR_FEED_LOOP_LIMIT || Number.MAX_SAFE_INTEGER;


const BACKFILL_ACTOR = process.env.BACKFILL_AUTHOR_HANDLE || process.env.FEEDGEN_PUBLISHER_DID;

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

export async function subscribeFollowed() {

    try {
        console.log(`[jetstream followed] Fetching followed feed for actor: ${BACKFILL_ACTOR}`);

        let loop = 0;
        let cursor = null;

        while (cursor !== undefined && loop < LOOP_LIMIT) {
            
            loop++;
            let cursorParam = cursor ? `&cursor=${cursor}` : '';

            const url = `${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.graph.getFollows?actor=${BACKFILL_ACTOR}&limit=${LIMIT}${cursorParam}`;
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
                            console.error(`[backfillPublisher] Request failed. Retrying... ${error.message}`);
                        },
                    ],
                },
            });

            for(const follow of response?.follows || []) {
                console.log(`[jetstream followed] Follow: ${follow.did} - ${follow.handle} - ${follow.displayName} - ${`${follow.description}`.replaceAll('\n', ' ').substring(0, 50)}`);

                authorDidEmitter.on(follow.did, (e) => { handleEvent( { record:e , listName:'followed.users' , actor:follow} )  });
            }
            
            cursor = response.cursor;
            console.log('[jetstream followed] Cursor:', cursor);
            if (!cursor) {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 900));
        }
    } catch (error) {
        console.error(`[jetstream followed] Error fetching followed feed: ${error.message}`);
    }
}

export async function subscribeListed() {
    console.log(`[jetstream listed] Starting backfilling lists.`);
    try {
        const listUrls = await getLists(BACKFILL_ACTOR);

        DEV_ENV && console.log(`[backfillListed] Found ${listUrls.length} lists for actor: ${BACKFILL_ACTOR}`, listUrls);
        
        for (const list of listUrls || []) {
            DEV_ENV && console.log(`[backfillListed] List: ${list.uri} - ${list.name}`);

            const listUsers = await getListedUsers(list.uri);

            for (const user of listUsers || []) {
                console.log(`[jetstream listed] User in list: ${user.handle} - ${user.did}`);

                authorDidEmitter.on(user.did, (e) => { handleEvent( { record:e , listName:list.name , actor:user }) });
            }
            
        }
    } catch (error) {
        console.error(`[jetstream listed] Error fetching lists: ${error.message}`);
    }
}


async function handleEvent(event) {
    try {
        console.log(`[jetstream handleEvent actor] New event for actor: ${event.actor.displayName}@${event.actor.handle}`);
        DEBUG && console.dir(event, { depth: null });


        const item = { post : { record : event.record, author : event.actor } };
        // item?.post?.record?.embed
        item.post.uri = event.record.uri;
        item.post.cid = 'jetstream::' + event.record.cid;
        item.post.indexedAt = new Date(event.record.createdAt || event.record.indexedAt || new Date());

        await upsertPost(item , listSfwScore(event.listName) );

        if (event.listName === 'followed.users') {
            await algoF(item.post.author.did);
            await initFollowedFeedCache();
            await initFollowedOrListedFeedCache();
        } else if (event.listName === 'NSFW') {
            await initFeedNSFW();
        } else {
            await algoL(item.post.author.did, event.listName);
            await initListedFeedCache(event.listName);
            await initFollowedOrListedFeedCache();
        }
    } catch (error) {
        console.error(`[jetstream handleEvent actor] Error handling event for actor: ${event.actor.displayName}@${event.actor.handle} - ${error.message}`);
    }
}