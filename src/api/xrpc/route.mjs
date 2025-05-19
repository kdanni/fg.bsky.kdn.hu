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

const getFeedSkeletonChain = [
    mw000,
    kdanniBud,
    kdanniPhoto,
    kdanniFollowed,
    kdanniListed,
    kdanniFollowedOrListed,
    zzz
];

router.get('/app.bsky.feed.getFeedSkeleton', getFeedSkeletonChain);

export default router;