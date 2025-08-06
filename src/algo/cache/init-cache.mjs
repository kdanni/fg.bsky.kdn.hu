import { constructCacheKey } from '../../api/xrpc/getFeedSkeleton/000.mjs';
import { getInitialFeedData } from '../../api/xrpc/getFeedSkeleton/util/fetchFeedData.mjs';
import { isRedisConnected, redisSet } from '../../redis/redis-io-connection.mjs';

import { shortname as shortnameNSFW, getInitialFeedData as getInitialFeedDataNSFW } from '../../api/xrpc/getFeedSkeleton/mw/nsfw.mjs';

export async function initFeedCache(shortname, shortnameArray, sfw = false) {
    if(!shortname){
        return;
    }
    let feedName = shortname;
    if(shortnameArray?.length > 0) {
        feedName = shortnameArray;
    }
    let initialFeedData = await getInitialFeedData(feedName, sfw);
    if (initialFeedData && initialFeedData.feed) {
        let cacheKey = constructCacheKey(shortname);
        await redisSet(cacheKey, JSON.stringify(initialFeedData), ['EX', 3000]);
        console.log(`[initCache] Cached initial feed data for ${cacheKey}`);
    }
}

export async function initFeedNSFW() {
    if (await isRedisConnected()) {
        try {
            let initialFeedDataNSFW = await getInitialFeedDataNSFW();
            if (initialFeedDataNSFW && initialFeedDataNSFW.feed) {
                let cacheKey = constructCacheKey(shortnameNSFW);
                await redisSet(cacheKey, JSON.stringify(initialFeedDataNSFW), ['EX', 3000]);
                console.log(`[initCache] Cached initial feed data for ${cacheKey}`);
            }
        } catch (error) {
            console.error('[initFeedNSFW] Error:', error);
        }
    }
}