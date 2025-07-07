async function handleRequest (req, res, next) {
    console.log('[getFeedSkeleton/zzz]');    
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