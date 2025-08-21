import { constructCacheKey } from '../../api/xrpc/getFeedSkeleton/000.mjs';
import { getInitialFeedData } from '../../api/xrpc/getFeedSkeleton/util/fetchFeedData.mjs';
import { isRedisConnected, redisSet } from '../../redis/redis-io-connection.mjs';
import { shortname as shortnameFavorites, getInitialFeedData as getInitialFeedDataFavorites } from '../../api/xrpc/getFeedSkeleton/mw/favorites.mjs';

import { shortname as shortnameNSFW, getInitialFeedData as getInitialFeedDataNSFW } from '../../api/xrpc/getFeedSkeleton/mw/nsfw.mjs';


import { getInitialFeedData as getInitialFeedDataF, shortname as shortnameF } from '../../api/xrpc/getFeedSkeleton/mw/followed.mjs';
import { getInitialFeedData as getInitialFeedDataL, shortname as shortnameL } from '../../api/xrpc/getFeedSkeleton/mw/listed.mjs';
import { getInitialFeedData as getInitialFeedDataFL, shortname as shortnameFL } from '../../api/xrpc/getFeedSkeleton/mw/followed_or_listed.mjs';


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

export async function initFavoritesFeedCache() {
    if (await isRedisConnected()) {
        try {
            let initialFeedDataFavorites = await getInitialFeedDataFavorites();
            if (initialFeedDataFavorites && initialFeedDataFavorites.feed) {
                let cacheKey = constructCacheKey(shortnameFavorites);
                await redisSet(cacheKey, JSON.stringify(initialFeedDataFavorites), ['EX', 3000]);
                console.log(`[initCache] Cached initial feed data for ${cacheKey}`);
            }
        } catch (error) {
            console.error('[initFavoritesFeedCache] Error:', error);
        }
    }
}


export async function initFollowedFeedCache() {
    if (await isRedisConnected()) {
        try {
            let initialFeedDataF = await getInitialFeedDataF();
            if (initialFeedDataF && initialFeedDataF.feed) {
                let cacheKey = constructCacheKey(shortnameF);
                await redisSet(cacheKey, JSON.stringify(initialFeedDataF), ['EX', 3000]);
                console.log(`[initFollowedFeedCache] Cached initial feed data for ${cacheKey}`);
            }
        } catch (error) {
            console.error('[initFollowedFeedCache] Error:', error);
        }
    }
}

export async function initListedFeedCache() {
    if (await isRedisConnected()) {
        try {
            let initialFeedDataL = await getInitialFeedDataL();
            if (initialFeedDataL && initialFeedDataL.feed) {
                let cacheKey = constructCacheKey(shortnameL);
                await redisSet(cacheKey, JSON.stringify(initialFeedDataL), ['EX', 3000]);
                console.log(`[initListedFeedCache] Cached initial feed data for ${cacheKey}`);
            }
        } catch (error) {
            console.error('[initListedFeedCache] Error:', error);
        }
    }
}

export async function initFollowedOrListedFeedCache() {
    if (await isRedisConnected()) {
        try {
            let initialFeedDataFL = await getInitialFeedDataFL();
            if (initialFeedDataFL && initialFeedDataFL.feed) {
                let cacheKey = constructCacheKey(shortnameFL);
                await redisSet(cacheKey, JSON.stringify(initialFeedDataFL), ['EX', 3000]);
                console.log(`[initFollowedOrListedFeedCache] Cached initial feed data for ${cacheKey}`);
            }
        } catch (error) {
            console.error('[initFollowedOrListedFeedCache] Error:', error);
        }
    }
}