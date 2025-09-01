import {pool} from '../db/prcEnv.connection.mjs';

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
    console.dir(feedLogicConfig, {depth: null});

    const { feed_name, sfw, mediaRegex, data } = feedLogicConfig;
    const { authorDidArray, negativeFilter, positiveFilter } = data;

    if(positiveFilter?.length < 1) {
        console.warn(`[CUSTOM-FEED-LOGIC] No positive filters found for feed: ${feed_name}`);
        return;
    }
    let negativeRegex = null;
    if(negativeFilter?.length > 0) {
        negativeRegex = new RegExp(negativeFilter.join('|'), 'i');
    }
    let filterAuthor = authorDidArray?.length > 0;    

    const iReg = new RegExp(`${mediaRegex}`, 'i');
    const posts = {};
    for (const tag of positiveFilter) {
        const posts1 = await pool.query(
            `call ${'sp_SELECT_recent_posts_by_text'}(?)`,
            [`%${tag}%`]
        );
        if (posts1[0] && posts1[0][0]) {
            for(const post of posts1[0][0]) {
                if(iReg.test(post.has_image || 'null')) {
                    if(negativeRegex && negativeRegex.test(post.text)) {
                        continue;
                    }
                    if(filterAuthor && !authorDidArray.includes(post.author_did)) {
                        continue;
                    }
                    posts[post.url] = post;
                }
            }
        }
    }
    for (const postUrl in posts) {
        const post = posts[postUrl];
        // Apply the feed logic to the post

        console.log(`[${feed_name}] Processing Post:`, JSON.stringify(post));

        const sql = `call ${'sp_UPSERT_feed_post'}(?,?,?,?,?)`;
        const params = [
            `${feed_name}`,
            post.url,
            Math.min(post.sfw, sfw),
            post.has_image,
            post.posted_at
        ];
        await pool.query(sql, params);
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}