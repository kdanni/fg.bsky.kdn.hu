const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

async function handleRequest (req, res, next) {
    DEBUG && console.log('[getFeedSkeleton/zzz]', 'Request.locals:', req.locals, 'Response.locals:', res.locals);
    DEV_ENV && !DEBUG && console.log('[getFeedSkeleton/zzz]', req.locals.cacheKey, 'FeedData:', `${res.locals.feedData}`, 'CachedData:', `${res.locals.cachedData}`);
    if(!res.locals.feedData) {
        res.json({
            feed: [],
            cursor: undefined,
        });
    } else {
        res.json(res.locals.feedData);
    }
    return next();
}

export default handleRequest;