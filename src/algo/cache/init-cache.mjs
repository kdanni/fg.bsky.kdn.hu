import { shortname as shortnameUBT, shortnameArray as shortnameArrayUBT } from '../../api/xrpc/getFeedSkeleton/mw/urban-brutal-tractor.mjs';
import { shortname as shortnameNUbex } from '../../api/xrpc/getFeedSkeleton/mw/not-urban-ex.mjs';
import { shortname as shortnameBrutal } from '../../api/xrpc/getFeedSkeleton/mw/brutalism-hashtag.mjs';
import { shortname as shortnameBud } from '../../api/xrpc/getFeedSkeleton/mw/budapest-hashtag.mjs';
import { shortname as shortnameKBud } from '../../api/xrpc/getFeedSkeleton/mw/kdanni-Bud.mjs';
import { shortname as shortnameKPhoto } from '../../api/xrpc/getFeedSkeleton/mw/kdanni-Photo.mjs';
import { shortname as shortnameMagyaro } from '../../api/xrpc/getFeedSkeleton/mw/magyaro-hashtag.mjs';
import { shortname as shortnameTractor } from '../../api/xrpc/getFeedSkeleton/mw/tractor-hashtag.mjs';
import { shortname as shortnameFood } from '../../api/xrpc/getFeedSkeleton/mw/food-images.mjs';
import { shortname as shortnameLandscape } from '../../api/xrpc/getFeedSkeleton/mw/landscape.mjs';
import { shortname as shortnameNSFW, getInitialFeedData as getInitialFeedDataNSFW } from '../../api/xrpc/getFeedSkeleton/mw/nsfw.mjs';
import { constructCacheKey } from '../../api/xrpc/getFeedSkeleton/000.mjs';
import { getInitialFeedData } from '../../api/xrpc/getFeedSkeleton/util/fetchFeedData.mjs';
import { isRedisConnected, redisSet } from '../../redis/redis-io-connection.mjs';
import { shortname as shortnameBudapestAll } from '../../api/xrpc/getFeedSkeleton/mw/budapest-all.mjs';
import { shortname as shortnameBudapestMeetings } from '../../api/xrpc/getFeedSkeleton/mw/budapest-meeting.mjs';
import { shortname as shortnameBudapestJobs } from '../../api/xrpc/getFeedSkeleton/mw/budapest-jobs.mjs';
import { shortname as shortnameTreescape } from '../../api/xrpc/getFeedSkeleton/mw/treescape.mjs';

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
            await initFeedCache(shortnameFood);
            await initFeedCache(shortnameLandscape);
            await initFeedCache(shortnameTreescape);
            await initFeedCache(shortnameBudapestAll);
            await initFeedCache(shortnameBudapestMeetings);
            await initFeedCache(shortnameBudapestJobs);
            // Initialize NSFW feed cache
            let initialFeedDataNSFW = await getInitialFeedDataNSFW();
            if (initialFeedDataNSFW && initialFeedDataNSFW.feed) {
                let cacheKey = constructCacheKey(shortnameNSFW);
                await redisSet(cacheKey, JSON.stringify(initialFeedDataNSFW), ['EX', 3000]);
                console.log(`[initCache] Cached initial feed data for ${cacheKey}`);
            }
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