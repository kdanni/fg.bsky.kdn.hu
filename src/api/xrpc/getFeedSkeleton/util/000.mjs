const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

async function handleRequest (req, res, next) {
    req.locals = req.locals || {};
    res.locals = res.locals || {};
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

    let initialCursor = false;
    let date0 = new Date();
    date0.setDate(date0.getDate() + 1);
    const cursor = req.query['cursor'];
    let cursorDate = date0;
    if(cursor) {
        // console.log(`[${shortname}] cursor`, cursor);
        const [timestamp, cid] = cursor.split('::');
        if (timestamp) {
            cursorDate = new Date(timestamp);
        }
        DEBUG && console.log(`[000] timestamp`, timestamp, cursorDate, cursor);
    } else {
        initialCursor = true;
    }
    req.locals.cursorDate = cursorDate;
    req.locals.cursorString = initialCursor ? 'initial' : `${cursorDate.getTime()}`;
    req.locals.cacheKey = `${feed}::${req.locals.cursorString}`;
    res.locals.cacheEX = 600; // Cache for 10 minutes

    next();
}

export default handleRequest;

export function constructCacheKey(shortname, cursorString) {
    const feedUriRoot = `at://${FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/`;
    cursorString = cursorString || 'initial';
    return `${feedUriRoot}${shortname}::${cursorString}`;
}