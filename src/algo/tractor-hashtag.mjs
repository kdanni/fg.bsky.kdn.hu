import { pool } from './connection/connection.mjs';
import { initFeedCache } from '../redis/init-cache.mjs';

export const shortname = 'tractorHashtag';

export const TAGS = [    
    '#tractor',
    '#traktor',
    '#tractors',
    '#TractorSky',
    '#TraktorSky',
    '#combineharvester',
    '#combine harvest',
    '#combine farm',
    '#harvester agriculture',
    '#harvester farm',
    '#harvester harvesting',
]

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
        const posts = [];
        for (const tag of TAGS) {
            const posts1 = await pool.query(
                `call ${'sp_SELECT_recent_posts_by_text'}(?)`,
                [`%${tag}%`]
            );
            if (posts1[0] && posts1[0][0]) {
                posts.push(...posts1[0][0]);
            }
        }
        
        if(posts[0] && posts[0][0]) {
            if(posts1[0] && posts1[0][0]) {
                posts[0][0] = [].concat(posts[0][0], posts1[0][0]);
            }

            for (const post of posts[0][0] || []) {
                // console.log(`[${shortname}]`, post.text);
                // console.log(`[${shortname}]`,'Filtered Post:', post);
                // if(/^image\//.test(`${post.has_image}`)) {
                    if (/#tractors?\b/i.test(post.text)
                        || /#traktor\b/i.test(post.text)
                        || /#TractorSky\b/i.test(post.text)
                        || /#TraktorSky\b/i.test(post.text)
                        || /#combineharvester\b/i.test(post.text)
                        || /(farm)|(harvest)|(agric)/i.test(post.text)
                    ) {
                        if(/((farm)|(harvest)|(agric))/i.test(post.text)) {
                            if(!/(#combine)|(harvester\b)/i.test(post.text)) {
                                continue;
                            }
                        }
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
        await initFeedCache(shortname);
        console.log(`[${shortname}] Cache initialized`);
    } catch (error) {
        console.error(`[${shortname}] `, 'Error in runAlgo:', error);
    }
}

