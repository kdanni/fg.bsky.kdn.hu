import { getMimeStringOrNull, getLanguageOrEn } from '../post-process/util.mjs';
import got from 'got';

import { pool } from './connection/connection.mjs';
import { upsertPost } from '../post-process/upsert-post.mjs';

const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const LIMIT = process.env.ACTOR_AUTHOR_FEED_LIMIT || 50;
const LOOP_LIMIT = process.env.ACTOR_AUTHOR_FEED_LOOP_LIMIT || Number.MAX_SAFE_INTEGER;
const MINUS_DAYS = process.env.BACKFILL_MINUS_DAYS || 10;


const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

export async function backfillActor(backfillActor, sfw = 10) {
    try {
        console.log(`[backfillActor] Fetching author feed for actor: ${backfillActor}`);

        if (!backfillActor || (backfillActor?.length || 0) < 4) {
            console.error('[backfillActor] No actor provided');
            return;
        }

        try {
            const url = `${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.actor.getProfile?actor=${backfillActor}&limit=${LIMIT}`;
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
                            console.error(`[backfillActor] Request failed. Retrying... ${error.message}`);
                        },
                    ],
                },
            });
            if (response && response.did) {
                console.log(`[backfillActor] Actor found: ${response.did}, handle: ${response.handle}`);
                const sql = `call ${'sp_UPSERT_bsky_author'}(?, ?, ?, ?, ?, ?)`;
                const params = [
                    response.did || null,
                    response.handle || null,
                    response.displayName || response.handle || null,
                    response.avatar || null,
                    null,
                    sfw,
                ];
                pool.execute(sql, params);
            }
        } catch (error) {
            console.error('[backfillActor] Error:', error);
            return;
        }

        let loop = 0;
        let cursor = null;
        const minusXdays = new Date();
        minusXdays.setDate(minusXdays.getDate() - MINUS_DAYS);
        
        while (cursor !== undefined && loop < LOOP_LIMIT) {
            loop++;
            let cursorParam = cursor ? `&cursor=${cursor}` : '';
            
            // make an API call with kdanni.hu actor parameter to {{BSKY_PUBLIC_ROOT}}/xrpc/app.bsky.feed.getAuthorFeed
            const url = `${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.feed.getAuthorFeed?actor=${backfillActor}&limit=${LIMIT}${cursorParam}`;
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
                            console.error(`[backfillActor] Request failed. Retrying... ${error.message}`);
                        },
                    ],
                },
            });
            // console.log('[getAuthorFeed] Response:', response);
            if (response && response.feed) {
                DEV_ENV && console.log('[backfillActor] Cursor:', response.cursor);
                cursor = response.cursor;
                // console.log('[getAuthorFeed] Author feed data:', response.feed);
                // Process the feed data as needed
                // Loop in the feed array then emit an event for each item
                for (const item of (response.feed || [])) {
                    // console.log('[getAuthorFeed] Item:', item);

                    DEBUG && console.dir(item, {depth: null});
                    DEV_ENV && console.log('[backfillActor] Upserting item:', item?.post?.uri, item?.post?.record?.text, item?.post?.indexedAt);
                    
                    let authorDid = item?.post?.author?.did || null;
                    let authorHandle = item?.post?.author?.handle || null;
                    if(backfillActor !== authorDid && backfillActor !== authorHandle) {
                        DEBUG && console.log(`[backfillActor] Skipping item, author did: ${authorDid}, handle: ${authorHandle}`);
                        // repost will be skipped
                        continue;
                    }

                    // console.dir(item, {depth: null});
                 
                    if (item?.post?.indexedAt && new Date(item?.post?.indexedAt) < minusXdays) {
                        console.log(`[backfillActor] Post is older than ${MINUS_DAYS} days, skipping...`);
                        cursor = undefined;
                        break;
                    }
                    
                    await upsertPost(item, sfw);

                    await new Promise((resolve) => { setTimeout( resolve , 100 );});
                }
            } else {
                console.error('[backfillActor] No data found in response');
            }
            await new Promise((resolve) => { setTimeout( resolve , 1000 );});

        } // End of while loop

        console.log(`[backfillActor] Finished backfilling.`);
    } catch (error) {
        console.error('[backfillActor] Error:', error);
    }
}
