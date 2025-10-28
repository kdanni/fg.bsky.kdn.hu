import got from 'got';

import { backfillActor } from './backfill-actor.mjs';
import { runAlgo } from '../algo/followed.mjs';
import { runAlgo as algoForme } from '../algo/forme.mjs';

import { initFollowedFeedCache, initFollowedOrListedFeedCache } from '../redis/init-cache.mjs';

const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const LIMIT = process.env.AUTHOR_FEED_LIMIT || 50;
const LOOP_LIMIT = process.env.AUTHOR_FEED_LOOP_LIMIT || Number.MAX_SAFE_INTEGER;

const BACKFILL_ACTOR = process.env.BACKFILL_AUTHOR_HANDLE || process.env.FEEDGEN_PUBLISHER_DID;

const DEV_ENV = process.env.ENV === 'DEV';

export async function backfillFollowed() {

    try {
        console.log(`[backfillFollowed] Fetching followed feed for actor: ${BACKFILL_ACTOR}`);

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
                console.log(`[backfillFollowed] Follow: ${follow.did} - ${follow.handle} - ${follow.displayName} - ${`${follow.description}`.replaceAll('\n', ' ').substring(0, 50)}`);

                await backfillActor(follow.did);

                await runAlgo(follow.did);
            }
            
            cursor = response.cursor;
            console.log('[backfillFollowed] Cursor:', cursor);
            if (!cursor) {
                break;
            }
        } // End of while loop
        
        await algoForme();
        await initFollowedFeedCache();
        await initFollowedOrListedFeedCache();
    } catch (error) {
        console.error(`[backfillFollowed] Error fetching followed feed: ${error.message}`);
    }
}