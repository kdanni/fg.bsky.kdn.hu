import express from 'express';
const router = express.Router();

//MW

import mw000 from './getFeedSkeleton/000.mjs';
import redis0 from './getFeedSkeleton/0-redis.mjs';
import redisz from './getFeedSkeleton/z-redis.mjs';
import zzz from './getFeedSkeleton/zzz.mjs';
import kdanniBud from './getFeedSkeleton/kdanni-Bud.mjs';
import kdanniPhoto from './getFeedSkeleton/kdanni-Photo.mjs';
import kdanniFollowed from './getFeedSkeleton/followed.mjs';
import kdanniListed from './getFeedSkeleton/listed.mjs';
import kdanniFollowedOrListed from './getFeedSkeleton/followed_or_listed.mjs';
import budapestHashtag from './getFeedSkeleton/budapest-hashtag.mjs';
import magyaroHashtag from './getFeedSkeleton/magyaro-hashtag.mjs';
import cf from './getFeedSkeleton/kdanni-CustomFeed.mjs';
import tractorHashtag from './getFeedSkeleton/tractor-hashtag.mjs';
import notUrbanEx from './getFeedSkeleton/not-urban-ex.mjs';
import musEj from './getFeedSkeleton/kdanni-MusEj.mjs';
import nsfw from './getFeedSkeleton/nsfw.mjs';
import brutal from './getFeedSkeleton/brutalism-hashtag.mjs';
import ubt from './getFeedSkeleton/urban-brutal-tractor.mjs';

const getFeedSkeletonChain = [
    mw000,
    redis0,
    kdanniBud,
    kdanniPhoto,
    kdanniFollowed,
    kdanniListed,
    kdanniFollowedOrListed,
    budapestHashtag,
    magyaroHashtag,
    tractorHashtag,
    brutal,
    notUrbanEx,
    ubt,
    musEj,
    cf,
    nsfw,
];
// Make sure to keep the order of the chain
getFeedSkeletonChain.push(redisz);
getFeedSkeletonChain.push(zzz);

router.get('/app.bsky.feed.getFeedSkeleton', getFeedSkeletonChain);

export default router;