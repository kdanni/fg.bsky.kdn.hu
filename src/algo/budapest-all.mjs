import { pool } from './connection/connection.mjs';
import { initFeedCache } from './cache/init-cache.mjs';

export const shortname = 'budapestAll';
import { shortname as shortnameMeetings } from './budapest-meetings.mjs';
import { shortname as shortnameJobsearch } from './budapest-jobsearch.mjs';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#📍Budapest posts',
      description: '📍Budapest or #Budapest tagged posts.',
      avatarFile: 'avatars/budapest3.jpg',
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
            ['%Budapest%']
        );

        // console.log('Posts:', posts[0][0]);

        if(posts[0] && posts[0][0]) {
            for (const post of posts[0][0] || []) {
                // if(/^image\//.test(`${post.has_image}`)) {
                    if (/\bevent\b/i.test(post.text) || /\bmeetup\b/i.test(post.text) 
                        || /\bmeetings?\b/i.test(post.text) || /\bconference\b/i.test(post.text)) {
                        DEV_ENV && console.log(`[${shortnameMeetings}]`,'Filtered Post:', post);

                        const sql = `call ${'sp_UPSERT_feed_post'}(?,?,?,?)`;
                        const params = [
                            `${shortnameMeetings}`,
                            post.url,
                            post.sfw,
                            post.posted_at
                        ];
                        await pool.query(sql, params);
                        await new Promise(resolve => setTimeout(resolve, 10));
                    } else if (/\b#job\b/i.test(post.text) || /\b#jobalert\b/i.test(post.text) 
                        || /\b#jobsearch\b/i.test(post.text) || /hiring\b/i.test(post.text)   
                    ) {
                        DEV_ENV && console.log(`[${shortnameJobsearch}]`,'Filtered Post:', post);

                        const sql = `call ${'sp_UPSERT_feed_post'}(?,?,?,?)`;
                        const params = [
                            `${shortnameJobsearch}`,
                            post.url,
                            post.sfw,
                            post.posted_at
                        ];
                        await pool.query(sql, params);
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }
                    else if (/#budapest/i.test(post.text) || /📍budapest/i.test(post.text)) {
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
        await initFeedCache(shortname, null, 1);
        console.log(`[${shortname}] Cache initialized`);
    } catch (error) {
        console.error(`[${shortname}] `, 'Error in runAlgo:', error);
    }
}

