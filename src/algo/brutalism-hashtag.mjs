import { pool } from './connection/connection.mjs';
import { initFeedCache } from './cache/init-cache.mjs';

export const shortname = 'brutalisHashtag';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Brutalism 🏢',
      description: '#brutalism #brutalist #BrutaliSky posts.',
      avatarFile: 'avatars/brutal.jpg',
    },
  ],
}

// const TARGET_AUTHOR_DID = process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID;
const DEV_ENV = process.env.ENV === 'DEV';
    

export async function runAlgo() {    
    console.log(`[${shortname}] Running algo...`);
    try {
        const posts = await pool.query(
            `call ${'sp_SELECT_recent_posts_by_text'}(?)`,
            ['%#brutali%']
        );
        
        if(posts[0] && posts[0][0]) {            
            for (const post of posts[0][0] || []) {
                // console.log(`[${shortname}]`, post.text);
                // console.log(`[${shortname}]`,'Filtered Post:', post);
                // if(/^image\//.test(`${post.has_image}`)) {
                    if (/#brutalism/i.test(post.text)
                        || /#brutalist/i.test(post.text)
                        || /#BrutaliSky\b/i.test(post.text)
                    ) {
                        DEV_ENV && console.log(`[${shortname}]`,'Filtered Post:', post);

                        const sql = `call ${'sp_UPSERT_feed_post'}(?,?,?,?)`;
                        const params = [
                            `${shortname}`,
                            post.url,
                            post.sfw,
                            post.posted_at
                        ];
                        await pool.query(sql, params);
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }
                // }
            }
        }

        console.log(`[${shortname}] Finished algo`);
        await initFeedCache(shortname);
        console.log(`[${shortname}] Cache initialized`);
    } catch (error) {
        console.error(`[${shortname}] `, 'Error in runAlgo:', error);
    }
}

