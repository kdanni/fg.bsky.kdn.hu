import got from 'got';
import { URLSearchParams } from 'url';

import { pool } from '../db/prcEnv.connection.mjs';
import { getSafeForWorkScore, getMimeStringOrNull, isArtwork } from '../post-process/util.mjs';

import { initFeedHUNlangALL } from '../redis/init-cache.mjs';

// const BSKY_SOCIAL_ROOT = process.env.BSKY_SOCIAL_ROOT || 'https://bsky.social';
const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

export async function jsBackfillNsfw () {
    try {
        const posts1 = await pool.query(
            `call ${'sp_SELECT_recent_jetstream_post'}()`, []
        );
        DEV_ENV && console.log('[jsBackfillNsfw] posts', posts1);
        if (posts1[0] && posts1[0][0]) {
            const arrayOfArrays = [];
            let array = []
            let i = 0
            for(const post of posts1[0][0]) {   
                DEBUG && console.log(`[jsBackfillNsfw] ${post.has_image} |`, post.text);
                i++;         
                array.push(post.url);
                if(i % 20 === 0) {
                    arrayOfArrays.push(array);
                    array = [];
                }
            }
            array.length > 0 && arrayOfArrays.push(array);
            DEBUG && console.dir(arrayOfArrays);
            
            for(array of arrayOfArrays) {
                try {
                    const qparams = new URLSearchParams();
                    array.forEach(uri => qparams.append('uris', uri));
                    
                    let result = await got(`${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.feed.getPosts?${qparams.toString()}`, {
                        responseType: 'json'
                    });

                    if (result && result.body && result.body.posts) {
                        console.log(`[js refillPosts] Found ${result.body.posts.length} posts to update.`);
                        for (const post of result.body.posts || []) {
        
                            // console.dir(post, { depth: 4, colors: true });
        
                            const authorDid = post.author?.did;
                            const bsky_author_SQL = `SELECT sfw FROM bsky_author WHERE did = ?`;
                            const bsky_author_params = [authorDid];
        
                            let autorSfwScore = 10;
        
                            const bsky_author_rows = await pool.query(bsky_author_SQL, bsky_author_params);
                            if (bsky_author_rows && bsky_author_rows[0] && bsky_author_rows[0][0]) {
                                const bsky_author = bsky_author_rows[0][0];
                                autorSfwScore = bsky_author.sfw;
                            }
        
        
                            let sfwScore = getSafeForWorkScore({post});
                            sfwScore = Math.min(sfwScore, autorSfwScore);
                            if (sfwScore < 7) {
                                DEV_ENV && console.log(`[js refillPosts] Post ${post.uri} is not safe for work, score: ${sfwScore}, Author SFW: ${autorSfwScore}`);
                            }
                            
                            let has_image = getMimeStringOrNull(post?.record?.embed);
                            has_image = isArtwork(post, has_image);
        
                            let updateSql = 'UPDATE feed_post SET sfw = LEAST(?, sfw), has_image = ? WHERE url = ?';
                            let updateParams = [sfwScore, has_image, post.uri];
                            await pool.query(updateSql, updateParams);
                            if(sfwScore < 2) {
                                let cid = 'nsfw::js::' + post?.cid||'';
                                updateParams = [sfwScore, has_image, cid, post.uri];
                                updateSql = 'UPDATE bsky_post SET sfw = LEAST(?, sfw), has_image = ? WHERE url = ?';
                            }
        
                            // await for a 2 ms delay to avoid rate limiting
                            await new Promise(resolve => setTimeout(resolve, 2));
                        }
                    } else {
                        console.log('[refillPosts]', result.body);
                    }

                } catch (ge) {
                    console.error('[jsBackfillNsfw] got ERROR', ge);
                    await new Promise(resolve => setTimeout(resolve, 4000));
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        await initFeedHUNlangALL();
    } catch (err) {
        console.error('[jsBackfillNsfw] ERROR', err);
    }
}