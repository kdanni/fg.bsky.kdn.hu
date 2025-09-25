import {pool} from '../db/prcEnv.connection.mjs';
import { initFeedCache } from '../redis/init-cache.mjs';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

const HISTORIC_ALGO_RUN = process.env.HISTORIC_ALGO_RUN === 'true' || false;

export async function applyCustomFeedLogic() {
    try {
        const feedLogic = await pool.query('CALL SP_SELECT_custom_feed_logic()');
        if(feedLogic[0] && feedLogic[0][0]) {
            // Apply the custom feed logic            
            for(const row of feedLogic[0][0]) {
                // console.dir(row, {depth: null});
                try {
                    await applyFeedLogic(row);                    
                } catch (error) {
                    console.error(`[CUSTOM-FEED-LOGIC] Error applying feed logic for row:`, JSON.stringify(row), error);
                }
            }
        }
    } catch (error) {
        console.error(`[CUSTOM-FEED-LOGIC] Error applying custom feed logic:`, error);
    }
}

async function applyFeedLogic(feedLogicConfig) {
    DEBUG && console.dir(feedLogicConfig, {depth: null});
    
    const { feed_name, sfw, sfwLimit, mediaRegex, data } = feedLogicConfig;
    const { authorDidArray, negativeFilter, positiveFilter, doubleNegativeFilter } = data;

    // if(feed_name === 'DebugDebugDebugDebug') {
    //     console.dir(feedLogicConfig, {depth: null});
    // }

    if(positiveFilter?.length < 1) {
        console.warn(`[CUSTOM-FEED-LOGIC] No positive filters found for feed: ${feed_name}`);
        return;
    }
    let negativeRegex = null;
    if(negativeFilter?.length > 0) {
        negativeRegex = new RegExp(negativeFilter.join('|'), 'i');
    }
    let doubleNegativeRegex = null;
    if(doubleNegativeFilter?.length > 0) {
        doubleNegativeRegex = new RegExp(doubleNegativeFilter.join('|'), 'i');
    }
    let filterAuthor = authorDidArray?.length > 0;

    const iReg = new RegExp(`${mediaRegex || '.*'}`, 'i');
    const minus4Days = new Date();
    minus4Days.setDate(minus4Days.getDate() - 4);

    for(const pos of positiveFilter) {
        let cursor = null;
        while(cursor !== undefined) {
            const posts = {};
            let next_cursor = undefined;
    
            let sql = `call ${'sp_SELECT_recent_posts_by_text'}(?)`;
            if(HISTORIC_ALGO_RUN) {
                sql = `call ${'sp_SELECT_not_recent_posts_by_text_and_cursor'}(?, ?, ?)`;
            }
            const sqlWhere = `${pos}`.replace(/\\b/g, '').replace(/\.\*/g, '%');
            let params = [`%${sqlWhere}%`];
            if(HISTORIC_ALGO_RUN) {
                params.push(cursor);
                params.push(500); // limit
            }
            DEV_ENV && console.log(`[CustomFeedLogic] [${feed_name}] Searching for posts with positive filter: ${pos} ${sqlWhere}`);
            const posts1 = await pool.query(sql, params);
            let allPostsCount = 0;
            if (posts1[0] && posts1[0][0]) {
                // DEV_ENV && console.log(`[${feed_name}] posts found: ${posts1[0][0].length}`);
                allPostsCount = posts1[0][0].length;
                for(const post of posts1[0][0]) {   
                    next_cursor = next_cursor === undefined || post.posted_at > next_cursor ? post.posted_at : next_cursor;
                    DEBUG && console.log(`[${feed_name}] ${post.has_image} |`, post.text);
                    if(!new RegExp(`${pos}`, 'i').test(post.text)) {                    
                        continue;
                    }
                    if(iReg.test(post.has_image || 'null')) {
                        if(negativeRegex && negativeRegex.test(post.text)) {
                            continue;
                        }
                        if(doubleNegativeRegex && !doubleNegativeRegex.test(post.text)) {
                            continue;
                        }
                        if(filterAuthor && !authorDidArray.includes(post.author_did)) {
                            continue;
                        }
                        posts[post.url] = post;
                    }
                }
                if(posts1[0][0].length < 10) {
                    cursor = undefined;
                    next_cursor = undefined;
                }
                if(next_cursor !== undefined && minus4Days < new Date(next_cursor)) {
                    next_cursor = undefined;
                    cursor = undefined;
                }
            }
            DEV_ENV && console.log(`[CustomFeedLogic] [${feed_name}] Found ${Object.keys(posts).length} / ${allPostsCount} cursor: ${cursor} next_cursor: ${next_cursor}`);
            for (const postUrl in posts) {
                const post = posts[postUrl];
                // Apply the feed logic to the post

                // DEBUG && console.log(`[${feed_name}] Processing Post:`, JSON.stringify(post));

                const sql = `call ${'sp_UPSERT_feed_post'}(?,?,?,?,?)`;
                const params = [
                    `${feed_name}`,
                    post.url,
                    Math.min(post.sfw, sfw),
                    post.has_image,
                    post.posted_at
                ];
                await pool.query(sql, params);
                // await new Promise(resolve => setTimeout(resolve, 10));
            }
            if(!HISTORIC_ALGO_RUN) {
                cursor = undefined;
            }
            else {
                cursor = next_cursor;
            }
        } // End while
    }
    await initFeedCache(feed_name, null, sfwLimit);
}

