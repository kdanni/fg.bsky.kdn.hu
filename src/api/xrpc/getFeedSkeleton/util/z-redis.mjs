import {
    isRedisConnected,
    redisSet,
} from '../../../../redis/redis-io-connection.mjs';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

async function handleRequest (req, res, next) {
    if(!await isRedisConnected()) {
        console.warn('Redis is not connected, not caching feed data');
        return next();
    }    
    const cacheKey = req.locals.cacheKey;
    DEV_ENV && console.log(`[z-redis] Cache key: ${cacheKey} FeedData: ${res.locals.feedData} CachedData: ${res.locals.cachedData}`);
    if(res.locals.feedData && cacheKey) {
        // Cache the feed data
        try {
            await redisSet(cacheKey, JSON.stringify(res.locals.feedData), ['EX', res.locals.cacheEX]);
            // console.log(`[z-redis] Cached feed data for ${cacheKey}`);
        } catch (error) {
            console.error(`[z-redis] Failed to cache feed data for ${cacheKey}:`, error);
        }
    }
    if(!res.locals.feedData && res.locals.cachedData) {
        res.locals.feedData = res.locals.cachedData; 
    }
    next();
}

export default handleRequest;