import { pool } from './connection/connection.mjs';
// import { initFeedCache } from '../redis/init-cache.mjs';

export const shortname = 'kdanni-Followed';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni.hu - Followed',
      description: 'Posts by my followed users. No replies. Don\'t have to see my own posts.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
}

const TARGET_AUTHOR_DID = process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID;
// const DEV_ENV = process.env.ENV === 'DEV';
    

export async function runAlgo(authorDid) {    
    if(!authorDid || authorDid === TARGET_AUTHOR_DID) {
        console.log(`[algo-followed] Skipping algo for ${authorDid}`);
        return;
    }
    try {
        pool.execute(`call ${'SP_followed_post_algo'}(?)`, [authorDid]);
    } catch (error) {
        console.error(`[algo-followed] `, 'Error in runAlgo:', error);
    }
    console.log(`[algo-followed] Finished algo for ${authorDid}`);
    // await initFeedCache(shortname);
    // console.log(`[${shortname}] Cache initialized`);
}