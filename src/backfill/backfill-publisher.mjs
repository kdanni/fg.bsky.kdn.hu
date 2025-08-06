import { getMimeStringOrNull, getLanguageOrEn } from './util.mjs';
import got from 'got';

import { pool } from './connection/connection.mjs';
import { upsertPost } from './upsert-post.mjs';

const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const LIMIT = process.env.PUBLISHER_AUTHOR_FEED_LIMIT || 50;
const LOOP_LIMIT = process.env.PUBLISHER_AUTHOR_FEED_LOOP_LIMIT || Number.MAX_SAFE_INTEGER;

const BACKFILL_ACTOR = process.env.BACKFILL_AUTHOR_HANDLE || process.env.FEEDGEN_PUBLISHER_DID;

const DEV_ENV = process.env.ENV === 'DEV';


export async function backfillPublisher() {
    try {
        console.log(`[backfillPublisher] Fetching author feed for actor: ${BACKFILL_ACTOR}`);

        let loop = 0;
        let cursor = null;

        while (cursor !== undefined && loop < LOOP_LIMIT) {
            loop++;
            let cursorParam = cursor ? `&cursor=${cursor}` : '';
            
            // make an API call with kdanni.hu actor parameter to {{BSKY_PUBLIC_ROOT}}/xrpc/app.bsky.feed.getAuthorFeed
            const url = `${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.feed.getAuthorFeed?actor=${BACKFILL_ACTOR}&limit=${LIMIT}${cursorParam}`;
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
            // console.log('[getAuthorFeed] Response:', response);
            let allnew = true;
            if (response && response.feed) {
                DEV_ENV && console.log('[backfillPublisher] Cursor:', response.cursor);
                cursor = response.cursor;
                // console.log('[getAuthorFeed] Author feed data:', response.feed);
                // Process the feed data as needed
                // Loop in the feed array then emit an event for each item
                for (const item of (response.feed || [])) {
                    // console.log('[getAuthorFeed] Item:', item);

                    const itemExists = await pool.query(
                        'SELECT cid FROM bsky_post WHERE cid = ? ', [item?.post?.cid||null]);
                    // console.log('[getAuthorFeed] Item exists in the database:', itemExists);
                    if (itemExists[0] && itemExists[0][0]) {
                        allnew = false;
                    }
                    
                    // console.dir(item, {depth: null});
                    DEV_ENV && console.log('[backfillPublisher] Upserting item:', item?.post?.uri, item?.post?.record?.text, item?.post?.indexedAt);
                    
                    await upsertPost(item);

                    await new Promise((resolve) => { setTimeout( resolve , 100 );});
                }
            } else {
                console.error('[backfillPublisher] No data found in response');
            }
            if (allnew === false) {
                cursor = undefined;
            }
            await new Promise((resolve) => { setTimeout( resolve , 1000 );});

        } // End of while loop

        console.log(`[backfillPublisher] Finished backfilling.`);
    } catch (error) {
        console.error('[backfillPublisher] Error:', error);
    }
}
