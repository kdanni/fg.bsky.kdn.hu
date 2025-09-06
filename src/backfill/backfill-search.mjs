import got from 'got';
import { getAuthToken } from '../bsky-social/auth.mjs';

import { upsertQuerySearchTerms } from '../mediawiki/media-wiki-bot.mjs';

import { pool } from './connection/connection.mjs';
import { upsertPost } from '../post-process/upsert-post.mjs';

import {updateArtistsMimeTag, updateAiMimeTag } from '../post-process/post-post-tagging.mjs';

const SKIP_AUTHORS_ARRAY = [];
const SKIP_KEYWORDS_ARRAY = [
    '#nft\\b',
    '#nfts\\b',
    '#nfttool',
    '#web3',
];

const BACKFILL_SEARCH_QUERIES = [];

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
    await upsertQuerySearchTerms();
    const querySearchTerms = await pool.execute('call SP_SELECT_backfill_search_queries()');
    if(querySearchTerms[0] && querySearchTerms[0][0]?.length) {
        BACKFILL_SEARCH_QUERIES.push(...querySearchTerms[0][0]);
    }
    for(const q of BACKFILL_SEARCH_QUERIES || []) {
        try {
            // console.log(`[backfillSearch] Running backfillSearch for query: ${JSON.stringify(q)}`);
            await backfillSearch(`${q.query}`, q.sfw);
            await new Promise((resolve) => { setTimeout( resolve , 1000 );});
        } catch (error) {
            console.error(`[backfillSearch] backfillSearchRunner() ERROR ${error}`)
        }
    }
}

import {applyCustomFeedLogic} from '../custom-feed/apply-custom-feed-logic.mjs';

export async function backfillSearchAlgoRunner () {
    console.log('[backfillSearch] Running algos');
    try {
        await applyCustomFeedLogic();

        await updateArtistsMimeTag();
        await updateAiMimeTag();
    } catch (e) {
        console.error('[backfillSearch] Algo Error', e);
    }
    console.log('[backfillSearch] Running algos done');
}

export async function backfillSearch(backfillSearchQuery, sfw = 10) {
    try {

        console.log(`[backfillSearch] Searching posts by query: ${backfillSearchQuery} sfw: ${sfw}`);

        if (!backfillSearchQuery || (backfillSearchQuery?.length || 0) < 2) {
            console.error('[backfillSearch] No actor provided');
            return;
        }

        // const sql = 'call upsert_backfill_search_query(?,?,?)';
        // const params = [`${backfillSearchQuery}`, JSON.stringify({ source : '[backfillSearch]' }), 10];
        // try {
        //     await pool.query(sql, params);
        // } catch (err) {
        //     console.error(`[backfillSearch] [err-BACKFILL-SEARCH-QUERY-UPSERT] ${err}`, err);
        // }

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
                    calculateDelay: () => { return 4000; },
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

                let safeForWorkScore = await upsertPost(item, sfw);
                
                const authorSql = `call ${'sp_UPSERT_bsky_author'}(?, ?, ?, ?, ?, ?)`;
                const authorParams = [
                    post.author?.did || null,
                    post.author?.handle || null,
                    post.author?.displayName || post.handle || null,
                    post.author?.avatar || null,
                    null,
                    safeForWorkScore != 10 ? 8 : 10, // default to 10 if not provided
                ];
                pool.execute(authorSql, authorParams);
                await new Promise((resolve) => { setTimeout( resolve , 100 );});
            }

            await new Promise((resolve) => { setTimeout( resolve , 1000 );});
        } // End of while loop
        console.log(`[backfillSearch] Finished backfilling.`);
    } catch (error) {
        console.error('[backfillSearch] Error:', error);
        await new Promise((resolve) => { setTimeout( resolve , 4000 );});
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