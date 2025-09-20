import got from 'got';
import { URLSearchParams } from 'url';

import { pool } from '../db/prcEnv.connection.mjs';
import { getSafeForWorkScore, getMimeStringOrNull, isArtwork } from '../post-process/util.mjs';

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
        }
    } catch (err) {
        console.error('[jsBackfillNsfw] ERROR', err);
    }
}