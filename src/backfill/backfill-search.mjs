import { getMimeStringOrNull } from './util.mjs';
import got from 'got';
import { getAuthToken } from '../bsky-social/auth.mjs';

import { pool } from './connection/connection.mjs';

export const BACKFILL_SEARCH_QUERIES = [
    '#Budapest',
    '#Magyarország',
    '#magyar',
    '#tractor',
    '#TractorSky',
]

// const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const BSKY_SOCIAL_ROOT = process.env.BSKY_SOCIAL_ROOT || 'https://bsky.social';
const LIMIT = process.env.SEARCH_POSTS_LIMIT || 50;
const LOOP_LIMIT = process.env.SEARCH_POSTS_LOOP_LIMIT || 3;
const MINUS_DAYS = process.env.SEARCH_BACKFILL_MINUS_DAYS || 3;


const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

const SEARCH_APP_HANDLE = process.env.SEARCH_APP_HANDLE ;
const SEARCH_APP_PASSWORD = process.env.SEARCH_APP_PASSWORD;

export async function backfillSearchRunner () {
    for(const q of BACKFILL_SEARCH_QUERIES || []) {
        try {
            await backfillSearch(`${q}`)
        } catch (error) {
            console.error(`[backfillSearch] backfillSearchRunner() ERROR ${error}`)
        }
    }
}

export async function backfillSearch(backfillSearchQuery) {
    try {

        console.log(`[backfillSearch] Searching posts by query: ${backfillSearchQuery}`);

        if (!backfillSearchQuery || (backfillSearchQuery?.length || 0) < 2) {
            console.error('[backfillSearch] No actor provided');
            return;
        }

        const auth = await getAuthToken(SEARCH_APP_HANDLE, SEARCH_APP_PASSWORD);
        if (!auth || !auth.accessJwt) {
            throw new Error('No access token retrieved');
        }
        const authBearerTokenHeaderValue = `Bearer ${auth.accessJwt}`;           
            
        let q = `${backfillSearchQuery}`;
        q = encodeURIComponent(q);

        let loop = 0;
        let cursor = null;
        const minusXdays = new Date();
        minusXdays.setDate(minusXdays.getDate() - MINUS_DAYS);
        let since = encodeURIComponent(minusXdays.toISOString());
        
        while (cursor !== undefined && loop < LOOP_LIMIT) {
            loop++;
            let cursorParam = cursor ? `&cursor=${cursor}` : '';
            
            const url = `${BSKY_SOCIAL_ROOT}/xrpc/app.bsky.feed.searchPosts?q=${q}` 
                + `&limit=${LIMIT}${cursorParam}&sort=latest&since=${since}`;
            DEV_ENV && console.log(`URL: ${url}`);
            const response = await got(url, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': authBearerTokenHeaderValue,
                    'Content-Type': 'application/json',
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
                            console.error(`[backfillSearch] Request failed. Retrying... ${error.message}`);
                        },
                    ],
                },
            });            
            
            DEV_ENV && console.log('[backfillSearch] Cursor:', response.cursor);
            cursor = response.cursor;
            // console.log('[getAuthorFeed] Author feed data:', response.feed);
            // Process the feed data as needed
            // Loop in the feed array then emit an event for each item
            for (const post of (response.posts || [])) {
                const item = {post};

                DEBUG && console.dir(post, {depth:null});

                let authorDid = item?.post?.author?.did || null;
                let authorHandle = item?.post?.author?.handle || null;

                let text = item?.post?.record?.text||'';

                DEV_ENV && console.log(`[backfillSearch] Post: Author: ${post.author?.handle} Text: ${(text).replace('\n',' ')}`);
                

                let has_image = getMimeStringOrNull(item?.post?.record?.embed);

                let replyParent = item?.post?.record?.reply?.parent?.uri || null;
                let replyRoot = item?.post?.record?.reply?.root?.uri || null;
                                    
                /**
                 * SP dont save replies. (reply if: replyParent or replyRoot is not null)
                 */
                const sql = `call ${'sp_UPSERT_bsky_post'}(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                // url VARCHAR(255),
                // cid VARCHAR(255),
                // author_did VARCHAR(255),
                // reply_to_cid VARCHAR(255),
                // text TEXT,
                // facets JSON,
                // embeds JSON,
                // posted_at datetime,
                const params = [
                    item?.post?.uri||null,
                    item?.post?.cid||null,
                    item?.post?.author?.did||null,
                    replyParent || replyRoot || null,
                    item?.post?.record?.text||'',
                    JSON.stringify(item?.post?.record?.facets||null),
                    JSON.stringify(item?.post?.record?.embed||null),
                    has_image||null,
                    item?.post?.indexedAt||null,
                ];
                pool.execute(sql, params);
                const authorSql = `call ${'sp_UPSERT_bsky_author'}(?, ?, ?, ?, ?)`;
                const authorParams = [
                    post.author?.did || null,
                    post.author?.handle || null,
                    post.author?.displayName || post.handle || null,
                    post.author?.avatar || null,
                    JSON.stringify({}),
                ];
                pool.execute(authorSql, authorParams);
                await new Promise((resolve) => { setTimeout( resolve , 100 );});
            }

        } // End of while loop

        console.log(`[backfillSearch] Finished backfilling.`);
    } catch (error) {
        console.error('[backfillSearch] Error:', error);
    }
}
