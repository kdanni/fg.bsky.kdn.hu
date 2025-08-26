import { constructCacheKey } from '../../api/xrpc/getFeedSkeleton/000.mjs';
import { getInitialFeedData } from '../../api/xrpc/getFeedSkeleton/util/fetchFeedData.mjs';
import { getInitialFeedData as getInitialFeedDataSP } from '../../api/xrpc/getFeedSkeleton/sp-fetch.mjs';
import { isRedisConnected, redisSet } from '../../redis/redis-io-connection.mjs';


import { shortname as shortnameFavorites} from '../favorites.mjs';
import { shortname as shortnameNSFW} from '../nsfw.mjs';
import { shortname as shortnameF } from '../followed.mjs';
import { shortname as shortnameL } from '../listed.mjs';
import { shortname as shortnameFL } from '../followed_or_listed.mjs';


export async function initFeedCache(shortname, shortnameArray, sfw = 2) {
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
    return initCacheBySP(shortnameNSFW);
}

export async function initFavoritesFeedCache() {
    return initCacheBySP(shortnameFavorites);
}


export async function initFollowedFeedCache() {
    return initCacheBySP(shortnameF);
}

export async function initListedFeedCache() {
    return initCacheBySP(shortnameL);
}

export async function initFollowedOrListedFeedCache() {
    return initCacheBySP(shortnameFL);
}

export async function initCacheBySP(shortname) {
if (await isRedisConnected()) {
        try {
            let initialFeedData = await getInitialFeedDataSP(shortname);
            if (initialFeedData && initialFeedData.feed) {
                let cacheKey = constructCacheKey(shortname);
                await redisSet(cacheKey, JSON.stringify(initialFeedData), ['EX', 3000]);
                console.log(`[initCacheBySP ${shortname}] Cached initial feed data for ${cacheKey}`);
            }
        } catch (error) {
            console.error(`[initCacheBySP ${shortname}] Error:`, error);
        }
    }
}