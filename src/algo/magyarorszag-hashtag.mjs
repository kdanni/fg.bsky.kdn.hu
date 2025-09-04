import { pool } from './connection/connection.mjs';
import { initFeedCache } from '../redis/init-cache.mjs';

export const shortname = 'magyaroHashtag';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Magyarország 🇭🇺',
      description: '#Magyarország or #magyar posts.',
      avatarFile: 'avatars/magyaro.jpg',
    },
  ],
}

// const TARGET_AUTHOR_DID = process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID;
const DEV_ENV = process.env.ENV === 'DEV';
    

export async function runAlgo() {    
    console.log(`[${shortname}] Running algo...`);
    try {
        // const posts = await pool.query(
        //     `call ${'sp_SELECT_recent_posts_by_text'}(?)`,
        //     ['%#Magyarország%']
        // );
        const posts = await pool.query(
            `call ${'sp_SELECT_recent_posts_by_text'}(?)`,
            ['%#Magyar%']
        );
        const posts2 = await pool.query(
            `call ${'sp_SELECT_recent_posts_by_text'}(?)`,
            ['%#🇭🇺%']
        );

        // console.log('Posts:', posts[0][0]);

        if(posts[0] && posts[0][0]) {
            if(posts2[0] && posts2[0][0]) {
                posts[0][0] = [].concat(posts[0][0]).concat(posts2[0][0]);
            }
            for (const post of posts[0][0] || []) {
                // console.log(`[${shortname}]`, post.text);
                // if(/^image\//.test(`${post.has_image}`)) {
                    if (/#magyarország/i.test(post.text)
                        || /#magyar\b/i.test(post.text)
                        || /#🇭🇺\b/i.test(post.text)
                    ) {
                        DEV_ENV && console.log(`[${shortname}]`,'Filtered Post:', post);

                        const sql = `call ${'sp_UPSERT_feed_post'}(?,?,?,?,?)`;
                        const params = [
                            `${shortname}`,
                            post.url,
                            post.sfw,
                            post.has_image,
                            post.posted_at
                        ];
                        await pool.query(sql, params);
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }
                // }
            }
        }

        console.log(`[${shortname}] Finished algo`);
        await initFeedCache(shortname, null , 7);
        console.log(`[${shortname}] Cache initialized`);
    } catch (error) {
        console.error(`[${shortname}] `, 'Error in runAlgo:', error);
    }
}

