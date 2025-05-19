import got from 'got';

import { pool } from './connection/connection.mjs';

const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const LIMIT = process.env.AUTHOR_FEED_LIMIT || 20;
const LOOP_LIMIT = process.env.AUTHOR_FEED_LOOP_LIMIT || 5;

const BACKFILL_ACTOR = process.env.BACKFILL_AUTHOR_HANDLE || process.env.FEEDGEN_PUBLISHER_DID;


export async function backfillPublisher() {
    try {
        console.log(`[getAuthorFeed] Fetching author feed for actor: ${BACKFILL_ACTOR}`);

        let loop = 0;
        let cursor = null;

        while (cursor !== undefined && loop < LOOP_LIMIT) {
            loop++;
            let cursorParam = cursor ? `&cursor=${cursor}` : '';
            
            // make an API call with kdanni.hu actor parameter to {{BSKY_PUBLIC_ROOT}}/xrpc/app.bsky.feed.getAuthorFeed
            const url = `${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.feed.getAuthorFeed?actor=${BACKFILL_ACTOR}&limit=${LIMIT}${cursorParam}`;
            console.log(`URL: ${url}`);
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
                            console.error(`[getAuthorFeed] Request failed. Retrying... ${error.message}`);
                        },
                    ],
                },
            });
            // console.log('[getAuthorFeed] Response:', response);
            let allnew = true;
            if (response && response.feed) {
                console.log('[getAuthorFeed] Cursor:', response.cursor);
                cursor = response.cursor;
                // console.log('[getAuthorFeed] Author feed data:', response.feed);
                // Process the feed data as needed
                // Loop in the feed array then emit an event for each item
                for (const item of (response.feed || []).reverse()) {
                    // console.log('[getAuthorFeed] Item:', item);

                    const itemExists = await pool.query(
                        'SELECT cid FROM bsky_post WHERE cid = ? ', [item?.post?.cid||null]);
                    // console.log('[getAuthorFeed] Item exists in the database:', itemExists);
                    if (itemExists[0] && itemExists[0][0]) {
                        allnew = false;
                    }
                    
                    // console.dir(item, {depth: null});
                    console.log('[getAuthorFeed] Upserting item:', item?.post?.uri, item?.post?.record?.text, item?.post?.indexedAt);
                    await new Promise((resolve) => { setTimeout( resolve , 100 );});
                 
                    let has_image = getMimeStringOrNull(item?.post?.record?.embed);
                    
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
                        item?.post?.reply?.parent?.cid||null,
                        item?.post?.record?.text||null,
                        JSON.stringify(item?.post?.record?.facets||null),
                        JSON.stringify(item?.post?.record?.embeds||null),
                        has_image||null,
                        item?.post?.indexedAt||null,
                    ];
                    pool.execute(sql, params);
                }
            } else {
                console.error('[getAuthorFeed] No data found in response');
            }
            if (allnew === false) {
                cursor = undefined;
            }
            await new Promise((resolve) => { setTimeout( resolve , 1000 );});

        } // End of while loop
    } catch (error) {
        console.error('[backfillPublisher] Error:', error);
    }
}


export function getMimeStringOrNull(embed) {
  if (!embed) return null;
  if (embed.$type === 'app.bsky.embed.images') {
    return embed.images?.some(
      (img) => img.image?.mimeType?.startsWith('image/')
    ) ? 'image/' : '?';
  }
  if (embed.$type === 'app.bsky.embed.recordWithMedia') {
    return getMimeStringOrNull(embed.media);
  }
  return 'embed?';
}
