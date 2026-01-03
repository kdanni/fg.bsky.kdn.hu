import got from 'got';
// import { getAuthToken } from '../bsky-social/auth.mjs';
import { URLSearchParams } from 'url';

import { pool } from './connection/connection.mjs';

import qe from './quoted-event-emitter.mjs';
import { upsertPostProcess } from '../post-process/upsert-post.mjs';


const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';

qe.on('quotedPost', handleUri );

export async function handleUri (uri) {
    try {
        if(uri  && /^at:\/\/[^/]+\/app.bsky.feed.generator\//.test(`${uri}`) ) {
            // "uri": "at://did:plc:j3qij7oqe6gie2x56gk5s6tx/app.bsky.feed.generator/top-posts"
            const qparams = new URLSearchParams();
            qparams.append('feed', uri);
            
            let result = await got(`${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.feed.getFeedGenerator?${qparams.toString()}`, {
                responseType: 'json'
            });

            if (result && result.body) {
                await upsertFeedGenerator(result.body);
            }            

        } else if(uri  && uri.startsWith('at://')) {
            const qparams = new URLSearchParams();
            qparams.append('uris', uri);
            
            let result = await got(`${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.feed.getPosts?${qparams.toString()}`, {
                responseType: 'json'
            });   

            if (result && result.body && result.body.posts) {
                // console.log(`[QuotedPost Handler] ${JSON.stringify(result.body)}`);
                for (const post of result.body.posts || []) {
                    await upsertPost({post});
                }
            }
            return true;
        }
    } catch (err) {
        console.error(err);
    }
}

export async function upsertPost(item, p_sfw = 10) {

    const post = await upsertPostProcess(item, p_sfw);
    
    /**
     * SP dont save replies. (reply if: replyParent or replyRoot is not null)
     */
    const sql = `call ${'sp_UPSERT_quoted_post'}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await pool.execute(sql, post.params);

    return post.safeForWorkScore;
}

export async function upsertFeedGenerator(item, p_sfw = 10) {
    console.dir(item, {depth:null});
    if(!item?.view?.uri) {
        return;
    }

    let uriMatch = /at:\/\/(did:plc:[^/]+)\/app.bsky.feed.generator\/([^/]+)/.exec(item.view.uri) || [item.view.uri,item.view.creator?.did,null];

    let text = `${item?.view?.displayName} \n\n ${item?.view?.description}`

    // bluesky post indexed / posted at time in UTC
    // item?.post?.indexedAt||null
    let posted_at_UTC = new Date(item?.view?.indexedAt||(new Date()).toLocaleTimeString('en-US', {timeZone: 'UTC'}));
    // convert to CET
    // Convert UTC to Europe/Budapest time (handles DST)
    let posted_at_CET = new Date(posted_at_UTC.toLocaleString('en-US', { timeZone: 'Europe/Budapest' }));

    let embed = item?.view?.embed || {};
    embed['author_object'] = item?.view?.creator;

    const params = [
        item?.view?.uri||null,
        item?.view?.cid||null,
        item?.view?.creator?.did||uriMatch[1]||null,
        null, // replyParent || replyRoot || null,
        text,
        'en',
        JSON.stringify(item?.view?.facets||null),
        JSON.stringify(embed),
        JSON.stringify(item?.view?.labels||null),
        'feed.generator', // has_image
        p_sfw,
        posted_at_CET,
    ];

    console.log(params);

    const sql = `call ${'sp_UPSERT_quoted_post'}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await pool.execute(sql, params);

}