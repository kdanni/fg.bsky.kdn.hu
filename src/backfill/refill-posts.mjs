import got from 'got';
// import { getAuthToken } from '../bsky-social/auth.mjs';

import { pool } from './connection/connection.mjs';
// import { upsertPost } from './upsert-post.mjs';
import { getSafeForWorkScore } from './util.mjs';

// const BSKY_SOCIAL_ROOT = process.env.BSKY_SOCIAL_ROOT || 'https://bsky.social';
const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';


export async function refillPosts() {
    try {

        let cursor = new Date();
        cursor.setHours(cursor.getHours() + 1);

        while (cursor) {
            const urls = [];
            const sql = `call ${'sp_SELECT_feed_posts_by_cursor'}(?,?)`;
            const params = [cursor, 25];

            const rows= await pool.query(sql, params);

            if (rows[0] && rows[0][0]) {
                for (const row of rows[0][0] || []) {
                    if (row) {
                        urls.push({ post: row.url });
                        cursor = row.posted_at ? new Date(row.posted_at) : null;
                    }
                }
            }

            // GET /xrpc/app.bsky.feed.getPosts
            // Query Parameters: 
            // - uris 
            //   - at-uri[]required
            //   - Possible values: <= 25

            // This endpoint is part of the Bluesky application Lexicon APIs (app.bsky.*). Public endpoints which don't require authentication can be made directly against the public Bluesky AppView API: https://public.api.bsky.app. Authenticated requests are usually made to the user's PDS, with automatic service proxying. Authenticated requests can be used for both public and non-public endpoints.

            let result = got(`${BSKY_PUBLIC_API_ROOT}/xrpc/app.bsky.feed.getPosts`, {
                searchParams: {
                    uris: urls.map(u => u.post).join(',')
                }
            });

            if (result && result.body && result.body.data && result.body.data.posts) {
                console.log(`[refillPosts] Found ${result.body.data.posts.length} posts to update.`);
                for (const post of result.body.data.posts || []) {
                    let sfwScore = getSafeForWorkScore(post);

                    const updateSql = 'UPDATE feed_post SET sfw = ? WHERE url = ?';
                    const updateParams = [sfwScore, post.uri];

                    await pool.query(updateSql, updateParams);

                    // await for a 10 ms delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }

            // await for a 1 second delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (urls.length < 25) {
                cursor = null; // No more posts to process
            }

            // TODO remove after debugging
            cursor = null; 
        }

    } catch (error) {
        console.error(`[refillPosts] refillPosts() ERROR ${error}`);
    }
}