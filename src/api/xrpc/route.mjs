import express from 'express';
const router = express.Router();

//MW

import mw000 from './getFeedSkeleton/000.mjs';
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
import notUberEx from './getFeedSkeleton/not-uber-ex.mjs';
import musEj from './getFeedSkeleton/kdanni-MusEj.mjs';

const getFeedSkeletonChain = [
    mw000,
    kdanniBud,
    kdanniPhoto,
    kdanniFollowed,
    kdanniListed,
    kdanniFollowedOrListed,
    budapestHashtag,
    magyaroHashtag,
    tractorHashtag,
    notUberEx,
    musEj,
    cf,
    zzz
];

router.get('/app.bsky.feed.getFeedSkeleton', getFeedSkeletonChain);

export default router;