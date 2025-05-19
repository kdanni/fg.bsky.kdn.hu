async function handleRequest (req, res, next) {
    console.log('[getFeedSkeleton/zzz]');
    res.json({
        feed: [],
        cursor: undefined,
    });
    return next();
}

export default handleRequest;