const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;

async function handleRequest (req, res, next) {
    const feed = req.query['feed'];
    if(!feed) {
        return next();
    }
    let regex = new RegExp(`^at://${FEEDGEN_PUBLISHER_DID}/app\.bsky\.feed\.generator/`, 'i');
    if(!regex.test(feed)) {
        res.status(400).json({
            error: 'Invalid feed URI',
            message: `Feed URI must start with at://FEEDGEN_PUBLISHER_DID/app.bsky.feed.generator/`
        });
        return;
    }
    next();
}

export default handleRequest;