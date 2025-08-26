import express from 'express';
const router = express.Router();

//MW

import mw000 from './getFeedSkeleton/000.mjs';
import redis0 from './getFeedSkeleton/0-redis.mjs';
import sfwFetch from './getFeedSkeleton/sfw-fetch.mjs';
import spFetch from './getFeedSkeleton/sp-fetch.mjs';
import feedOfFeeds from './getFeedSkeleton/feed-of-feeds.mjs';
import feedByFeedShortname from './getFeedSkeleton/feed-by-shortname.mjs';
import redisz from './getFeedSkeleton/z-redis.mjs';
import zzz from './getFeedSkeleton/zzz.mjs';

const getFeedSkeletonChain = [
    mw000,
    redis0,
    sfwFetch,
    spFetch,
    feedOfFeeds,
    feedByFeedShortname,
    redisz,
    zzz
];

router.get('/app.bsky.feed.getFeedSkeleton', getFeedSkeletonChain);

export default router;