import express from 'express';
const router = express.Router();

//MW

import mw000 from './getFeedSkeleton/000.mjs';
import redis0 from './getFeedSkeleton/0-redis.mjs';
import redisz from './getFeedSkeleton/z-redis.mjs';
import zzz from './getFeedSkeleton/zzz.mjs';
import kdanniBud from './getFeedSkeleton/mw/kdanni-Bud.mjs';
import kdanniOutofBud from './getFeedSkeleton/mw/kdanni-outOfBud.mjs';
import kdanniBudOutofBud from './getFeedSkeleton/mw/kdanni-Bud-Out-of-Bud.mjs';
import kdanniPhoto from './getFeedSkeleton/mw/kdanni-Photo.mjs';
import kdanniFollowed from './getFeedSkeleton/mw/followed.mjs';
import kdanniListed from './getFeedSkeleton/mw/listed.mjs';
import kdanniFollowedOrListed from './getFeedSkeleton/mw/followed_or_listed.mjs';
import budapestHashtag from './getFeedSkeleton/mw/budapest-hashtag.mjs';
import magyaroHashtag from './getFeedSkeleton/mw/magyaro-hashtag.mjs';
import cf from './getFeedSkeleton/mw/kdanni-CustomFeed.mjs';
import tractorHashtag from './getFeedSkeleton/mw/tractor-hashtag.mjs';
import notUrbanEx from './getFeedSkeleton/mw/not-urban-ex.mjs';
import musEj from './getFeedSkeleton/mw/kdanni-MusEj.mjs';
import nsfw from './getFeedSkeleton/mw/nsfw.mjs';
import brutal from './getFeedSkeleton/mw/brutalism-hashtag.mjs';
import ubt from './getFeedSkeleton/mw/urban-brutal-tractor.mjs';
import sm from './getFeedSkeleton/mw/socialist-modernism.mjs';
import food from './getFeedSkeleton/mw/food-images.mjs';
import landscape from './getFeedSkeleton/mw/landscape.mjs';

const getFeedSkeletonChain = [
    mw000,
    redis0,
    kdanniBud,
    kdanniOutofBud,
    kdanniBudOutofBud,
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
    sm,
    food,
    musEj,
    cf,
    nsfw,
    landscape,
];
// Make sure to keep the order of the chain
getFeedSkeletonChain.push(redisz);
getFeedSkeletonChain.push(zzz);

router.get('/app.bsky.feed.getFeedSkeleton', getFeedSkeletonChain);

export default router;