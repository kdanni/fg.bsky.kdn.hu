import { pool } from './connection/connection.mjs';

export const shortname = 'food-images';

export const TAGS = [
    '#foodsky',
    '#recipe',
    '#recipes',
    '#dish',
    '#cuisine',
    '🍜',
    '#ごはん',
    '#foodporn',
    '#ramen',
    '#ラメン',

]

const tagsRegexArray = TAGS.map(tag => `${tag}\\b`).join('|');
const tagsRegex = new RegExp(tagsRegexArray, 'i');

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Food Images 🍜',
      description: `Hashtag included: ${TAGS.join(' ')}`,
      avatarFile: 'avatars/food-images.jpg',
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
               
        if(posts && posts.length > 0) {
            for (const post of posts || []) {
                // console.log(`[${shortname}]`, post.text);
                // console.log(`[${shortname}]`,'Filtered Post:', post);
                if(/^image\//.test(`${post.has_image}`)) {
                    if (`${post.text}`.includes('🍜') || tagsRegex.test(post.text)){
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
                }
            }
        }

        console.log(`[${shortname}] Finished algo`);
    } catch (error) {
        console.error(`[${shortname}] `, 'Error in runAlgo:', error);
    }
}

