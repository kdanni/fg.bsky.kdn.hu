import { pool } from './connection/connection.mjs';

export const shortname = 'tractorHashtag';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Tractor 🚜',
      description: '#tractor posts. Warning maybe NSFW.',
      avatarFile: 'avatars/tractor.jpg',
    },
  ],
}

// const TARGET_AUTHOR_DID = process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID;
const DEV_ENV = process.env.ENV === 'DEV';
    

export async function runAlgo() {    
    console.log(`[${shortname}] Running algo...`);
    try {
        const posts1 = await pool.query(
            `call ${'sp_SELECT_recent_posts_by_text'}(?)`,
            ['%#traktor%']
        );
        const posts2 = await pool.query(
            `call ${'sp_SELECT_recent_posts_by_text'}(?)`,
            ['%#tractor%']
        );
        const posts = [].concat(posts1, posts2);

        // console.log('Posts:', posts[0][0]);

        if(posts[0] && posts[0][0]) {
            for (const post of posts[0][0] || []) {
                // console.log(`[${shortname}]`, post.text);
                // if(/^image\//.test(`${post.has_image}`)) {
                    if (/#tractor\b/i.test(post.text)
                        || /#traktor\b/i.test(post.text)
                        || /#TractorSky\b/i.test(post.text)
                        || /#TraktorSky\b/i.test(post.text)
                    ) {
                        DEV_ENV && console.log(`[${shortname}]`,'Filtered Post:', post);

                        const sql = `call ${'sp_UPSERT_feed_post'}(?,?,?)`;
                        const params = [
                            `${shortname}`,
                            post.url,
                            post.posted_at
                        ];
                        await pool.query(sql, params);
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }
                // }
            }
        }

        console.log(`[${shortname}] Finished algo`);
    } catch (error) {
        console.error(`[${shortname}] `, 'Error in runAlgo:', error);
    }
}

