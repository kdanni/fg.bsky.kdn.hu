import got from 'got';
import { getAuthToken } from '../bsky-social/auth.mjs';

import { getMimeStringOrNull, getLanguageOrEn, getSafeForWorkScore } from './util.mjs';

// const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const BSKY_SOCIAL_ROOT = process.env.BSKY_SOCIAL_ROOT || 'https://bsky.social';
const LIMIT = process.env.SEARCH_POSTS_LIMIT || 50;
const LOOP_LIMIT = process.env.PUBLISHER_AUTHOR_FEED_LOOP_LIMIT || Number.MAX_SAFE_INTEGER;

const REGISTRATION_APP_HANDLE = process.env.REGISTRATION_APP_HANDLE;
const REGISTRATION_APP_PASSWORD = process.env.REGISTRATION_APP_PASSWORD;

const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;
const FEEDGEN_HOSTNAME = process.env.FEEDGEN_HOSTNAME;


const BACKFILL_ACTOR = process.env.BACKFILL_AUTHOR_HANDLE || process.env.FEEDGEN_PUBLISHER_DID;

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

import { pool } from './connection/connection.mjs';

const DEFAULT_FAVORITES_ACTOR_VALUE = 'FEEDGEN_PUBLISHER';

import { initFavoritesFeedCache } from '../algo/cache/init-cache.mjs';

export async function backfillFavoritesRunner() {
    await backfillFavorites(BACKFILL_ACTOR);
    await initFavoritesFeedCache();
}

export async function backfillFavorites(actor = BACKFILL_ACTOR) {
    try {
        let loop = 0;
        let cursor = null;

        let actorValue = BACKFILL_ACTOR === actor ? DEFAULT_FAVORITES_ACTOR_VALUE : actor;

        const auth = await getAuthToken(REGISTRATION_APP_HANDLE, REGISTRATION_APP_PASSWORD);
        if (!auth || !auth.accessJwt) {
            throw new Error('No access token retrieved');
        }
        const authBearerTokenHeaderValue = `Bearer ${auth.accessJwt}`;

        while (cursor !== undefined && loop < LOOP_LIMIT) {
            loop++;
            let cursorParam = cursor ? `&cursor=${cursor}` : '';
                

            // Fetch /xrpc/app.bsky.feed.getActorLikes from BlueSky API
            const url = `${BSKY_SOCIAL_ROOT}/xrpc/app.bsky.feed.getActorLikes?actor=${actor}${cursorParam}`;
            DEV_ENV && console.log(`URL: ${url}`);
            const response = await got(url, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': authBearerTokenHeaderValue,
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
                            console.error(`[backfill favorites] Request failed. Retrying... ${error.message}`);
                        },
                    ],
                },
            });
            // console.log(`[backfill favorites] Response: ${JSON.stringify(response)}`);

            let allnew = true;
            if (response && response.feed) {

                for (const item of (response.feed || [])) {
                    DEV_ENV && console.log('[backfillPublisher] Cursor:', response.cursor);
                    cursor = response.cursor;
                    
                    const itemExists = await pool.query(
                        'SELECT url FROM favorites_post WHERE url = ? ', [item?.post?.uri||null]);
                    // console.log('[getAuthorFeed] Item exists in the database:', itemExists);
                    if (itemExists[0] && itemExists[0][0]) {
                        allnew = false;
                    }

                    DEV_ENV && console.log('[backfill favorites] Upserting item:', item?.post?.uri, item?.post?.record?.text, item?.post?.indexedAt);

                    let has_image = getMimeStringOrNull(item?.post?.record?.embed);
                    // let langs = getLanguageOrEn(item?.post?.record);

                    let replyParent = item?.post?.record?.reply?.parent?.uri || null;
                    let replyRoot = item?.post?.record?.reply?.root?.uri || null;

                    let safeForWorkScore = getSafeForWorkScore(item);
                    // safeForWorkScore = Math.min(safeForWorkScore, p_sfw);
                    
                    if(replyParent !== null || replyRoot !== null) {
                        actorValue = `${actorValue}_reply`;
                        DEV_ENV && console.log(`[backfill favorites] ${actorValue}_reply`, item?.post?.uri, item?.post?.record?.text, item?.post?.indexedAt);
                    }

                    // CREATE PROCEDURE upsert_favorites_post (
                    // IN p_url VARCHAR(200),
                    // IN p_has_image VARCHAR(64),
                    // IN p_sfw INT,
                    // IN p_actor VARCHAR(200),
                    // IN p_posted_at datetime
                    // )

                    const sql = 'CALL upsert_favorites_post(?, ?, ?, ?, ?)';
                    const params = [
                        item?.post?.uri||null,
                        has_image||null,
                        safeForWorkScore||-1,
                        actorValue||null,
                        item?.post?.indexedAt||null
                    ];

                    await pool.execute(sql, params);
                    await new Promise((resolve) => { setTimeout( resolve , 10 );});
                }

                // Debug
                // cursor = undefined;
            } else {
                console.error('[backfill favorites] No data found in response');
            }
            if (allnew === false) {
                cursor = undefined;
            }
            await new Promise((resolve) => { setTimeout( resolve , 1000 );});
        }
    } catch (error) {
        console.error(`[backfill favorites] Error: ${error.message}`);
    }
}