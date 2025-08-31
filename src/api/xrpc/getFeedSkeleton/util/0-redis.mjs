import {
    isRedisConnected,
    redisGet,
} from '../../../../redis/redis-io-connection.mjs';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

async function handleRequest (req, res, next) {
    if(!await isRedisConnected()) {
        console.warn('[0-redis] Redis is not connected, not caching feed data');
        return next();
    }
    const feed = req.query['feed'];
    if(!feed) {
        return next();
    }
    const cacheKey = req.locals.cacheKey;
    const cachedData = await redisGet(cacheKey);
    if (cachedData) {
        res.locals.cachedData = JSON.parse(cachedData);
        console.log(`[0-redis] Cache key: ${cacheKey}, Cached data: ${res.locals.cachedData}`);
    } else {
        DEV_ENV && console.log(`[0-redis] Cache key: ${cacheKey}, No cached data found`);
    }
    next();
}

export default handleRequest;