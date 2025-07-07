import { pool } from './connection/connection.mjs';
import { getInitialFeedData } from '../api/xrpc/getFeedSkeleton/listed.mjs';
import { constructCacheKey } from '../api/xrpc/getFeedSkeleton/000.mjs';
import { isRedisConnected, redisSet } from '../redis/redis-io-connection.mjs';

export const shortname = 'kdanni-Listed';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni.hu - Listed',
      description: 'Posts by users on my list. No replies.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
}

const TARGET_AUTHOR_DID = process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID;
// const DEV_ENV = process.env.ENV === 'DEV';
    

export async function runAlgo(authorDid, listName) {    
    if(!authorDid || authorDid === TARGET_AUTHOR_DID) {
        console.log(`[algo-listed] Skipping algo for ${authorDid}`);
        return;
    }
    listName = listName || 'listed posts';
    try {
        pool.execute(`call ${'SP_listed_post_algo'}(?,?)`, [authorDid, listName]);

        if(await isRedisConnected()) {
            let initialFeedData = await getInitialFeedData();
            if (initialFeedData && initialFeedData.feed) {
                let cacheKey = constructCacheKey(shortname);
                await redisSet(cacheKey, JSON.stringify(initialFeedData), ['EX', 3000]); 
                console.log(`[algo-listed] Cached initial feed data for ${cacheKey}`);
            }
        }
    } catch (error) {
        console.error(`[algo-listed] `, 'Error in runAlgo:', error);        
    }
    console.log(`[algo-listed] Finished algo for ${authorDid}`);
}