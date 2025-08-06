import { getMimeStringOrNull, getLanguageOrEn } from './util.mjs';
import got from 'got';
import { getAuthToken } from '../bsky-social/auth.mjs';

import { pool } from './connection/connection.mjs';
import { upsertPost } from './upsert-post.mjs';

const SKIP_AUTHORS_ARRAY = [];
const SKIP_KEYWORDS_ARRAY = [
    '#nft\b',
    '#nfts\b',
    '#nfttool',
    '#web3',
];

import { TAGS } from '../algo/not-urban-ex.mjs'; 
import { TAGS as TAGS2 } from '../algo/socialist-modernism.mjs'; 
import { TAGS as TAGS3 } from '../algo/food-images.mjs'; 
import { TAGS as TAGS4 } from '../algo/landscape.mjs'; 
import { TAGS as TAGS5 } from '../algo/treescape.mjs';

export const BACKFILL_SEARCH_QUERIES = [
    '#Budapest',
    '📍Budapest',
    '#Magyarország',
    '#magyar',
    '#tractor',
    '#TractorSky',
    '#brutalism',
    '#brutalista',
    '#blrutalist',
    '#brutalisky',
]

BACKFILL_SEARCH_QUERIES.push(...TAGS);
BACKFILL_SEARCH_QUERIES.push(...TAGS2);
BACKFILL_SEARCH_QUERIES.push(...TAGS3);
BACKFILL_SEARCH_QUERIES.push(...TAGS4);
BACKFILL_SEARCH_QUERIES.push(...TAGS5);

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

import { runAlgo as brutalism } from '../algo/brutalism-hashtag.mjs';
import { runAlgo as budapestAll } from '../algo/budapest-all.mjs';
import { runAlgo as budTag } from '../algo/budapest-hashtag.mjs';
import { runAlgo as food } from '../algo/food-images.mjs';
import { runAlgo as landscape } from '../algo/landscape.mjs';
import { runAlgo as moTag } from '../algo/magyarorszag-hashtag.mjs';
import { runAlgo as notUrbanEx } from '../algo/not-urban-ex.mjs';
import { runAlgo as sm } from '../algo/socialist-modernism.mjs';
import { runAlgo as tractor } from '../algo/tractor-hashtag.mjs';
import { runAlgo as treescape } from '../algo/treescape.mjs';
import { runAlgo as UBT } from '../algo/urban-brutal-tractor.mjs';

export async function backfillSearchAlgoRunner () {
    console.log('[backfillSearch] Running algos');
    await Promise.all([
        budTag(),
        moTag(),
        tractor(),
        notUrbanEx(),
        brutalism(),
        sm(),
        food(),
        landscape(),
        treescape(),
        budapestAll(),
        UBT(),
    ]).catch((e) => {
        console.error('[backfillSearch] Algo Error', e);
    });
    console.log('[backfillSearch] Running algos done');
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
                
                if( await skipPost(text, authorDid, authorHandle) ) {
                    DEV_ENV && console.log(`[backfillSearch] Skipping post: ${authorHandle} - ${text}`);
                    continue;
                }

                let safeForWorkScore = await upsertPost(item);
                
                const authorSql = `call ${'sp_UPSERT_bsky_author'}(?, ?, ?, ?, ?)`;
                const authorParams = [
                    post.author?.did || null,
                    post.author?.handle || null,
                    post.author?.displayName || post.handle || null,
                    post.author?.avatar || null,
                    JSON.stringify({}),
                    safeForWorkScore != 10 ? 8 : 10, // default to 10 if not provided
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

async function skipPost(text, authorHandle) {
    if (SKIP_AUTHORS_ARRAY.includes(authorHandle)) {
        return true;
    }
    for (const keyword of SKIP_KEYWORDS_ARRAY) {
        let reg = new RegExp(keyword, 'i');
        if (reg.test(text)) {
            return true;
        }
    }
    return false;
}