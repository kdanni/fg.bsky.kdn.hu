import { pool } from './connection/connection.mjs';

export const shortname = 'kdn-CustomFeed';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni.hu - #CustomFeed',
      description: 'My custom feed announcements.',
      avatarFile: 'avatars/sky.jpg',
    },
  ],
}

const TARGET_AUTHOR_DID = process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID;
const DEV_ENV = process.env.ENV === 'DEV';
    

export async function runAlgo() {    
    console.log(`[${shortname}] Running algo...`);
    try {
        const posts = await pool.query(
            // `call ${'sp_SELECT_old_posts'}(?)`,
            `call ${'sp_SELECT_recent_posts'}(?)`,
            [TARGET_AUTHOR_DID]
        );

        // console.log('Posts:', posts[0][0]);

        if(posts[0] && posts[0][0]) {
            for (const post of posts[0][0] || []) {
                // if(/^image\//.test(`${post.has_image}`)) {
                    if (/#CustomFeed\b/i.test(post.text)) {
                        // DEV_ENV && console.log(`[${shortname}]`,'Filtered Post:', post);

                        const sql = `call ${'sp_UPSERT_feed_post'}(?,?,?)`;
                        const params = [
                            `${shortname}`,
                            post.url,
                            post.posted_at
                        ];
                        await pool.query(sql, params);
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                // }
            }
        }

        console.log(`[${shortname}] Finished algo`);
    } catch (error) {
        console.error(`[${shortname}] `, 'Error in runAlgo:', error);
    }
}

