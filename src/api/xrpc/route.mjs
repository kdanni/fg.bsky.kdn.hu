import express from 'express';
const router = express.Router();

//MW

import mw000 from './getFeedSkeleton/util/000.mjs';
import redis0 from './getFeedSkeleton/util/0-redis.mjs';
import spFetch from './getFeedSkeleton/sp-fetch.mjs';
import feedByFeedShortname from './getFeedSkeleton/feed-by-shortname.mjs';
import redisz from './getFeedSkeleton/util/z-redis.mjs';
import zzz from './getFeedSkeleton/util/zzz.mjs';

const getFeedSkeletonChain = [
    mw000,
    redis0,
    spFetch,
    feedByFeedShortname,
    redisz,
    zzz
];

router.get('/app.bsky.feed.getFeedSkeleton', getFeedSkeletonChain);

export default router;