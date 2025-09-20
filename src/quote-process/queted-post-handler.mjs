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
        if(uri  && uri.startsWith('at://')) {
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