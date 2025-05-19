async function handleRequest (req, res, next) {
    console.log('[getFeedSkeleton/zzz]');
    res.json({
        feed: [],
        cursor: null,
    });
    return next();
}

export default handleRequest;