import { shortname as shortnameUBT, shortnameArray as shortnameArrayUBT } from '../../api/xrpc/getFeedSkeleton/urban-brutal-tractor.mjs';
import { shortname as shortnameNUbex } from '../../api/xrpc/getFeedSkeleton/not-urban-ex.mjs';
import { shortname as shortnameBrutal } from '../../api/xrpc/getFeedSkeleton/brutalism-hashtag.mjs';
import { shortname as shortnameBud } from '../../api/xrpc/getFeedSkeleton/budapest-hashtag.mjs';
import { shortname as shortnameKBud } from '../../api/xrpc/getFeedSkeleton/kdanni-Bud.mjs';
import { shortname as shortnameKPhoto } from '../../api/xrpc/getFeedSkeleton/kdanni-Photo.mjs';
import { shortname as shortnameMagyaro } from '../../api/xrpc/getFeedSkeleton/magyaro-hashtag.mjs';
import { shortname as shortnameTractor } from '../../api/xrpc/getFeedSkeleton/tractor-hashtag.mjs';
import { shortname as shortnameNSFW } from '../../api/xrpc/getFeedSkeleton/nsfw.mjs';
import { constructCacheKey } from '../../api/xrpc/getFeedSkeleton/000.mjs';
import { getInitialFeedData } from '../../api/xrpc/getFeedSkeleton/util/fetchFeedData.mjs';
import { isRedisConnected, redisSet } from '../../redis/redis-io-connection.mjs';

export async function initCache() {
    try {
        if (await isRedisConnected()) {
            await initFeedCache(shortnameUBT, shortnameArrayUBT);
            await initFeedCache(shortnameNUbex);            
            await initFeedCache(shortnameBrutal);
            await initFeedCache(shortnameBud);
            await initFeedCache(shortnameKBud);
            await initFeedCache(shortnameKPhoto);
            await initFeedCache(shortnameMagyaro);
            await initFeedCache(shortnameTractor);
            await initFeedCache(shortnameNSFW);
        }
    } catch (error) {
        console.error('[initCache] Error:', error);
    }
}

async function initFeedCache(shortname, shortnameArray) {
    if(!shortname){
        return;
    }
    let feedName = shortname;
    if(shortnameArray?.length > 0) {
        feedName = shortnameArray;
    }
    let initialFeedData = await getInitialFeedData(feedName);
    if (initialFeedData && initialFeedData.feed) {
        let cacheKey = constructCacheKey(shortname);
        await redisSet(cacheKey, JSON.stringify(initialFeedData), ['EX', 3000]);
        console.log(`[initCache] Cached initial feed data for ${cacheKey}`);
    }
}