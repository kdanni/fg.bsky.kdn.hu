import express from 'express';
const router = express.Router();

//MW

import mw000 from './getFeedSkeleton/000.mjs';
import zzz from './getFeedSkeleton/zzz.mjs';
import kdanniBud from './getFeedSkeleton/kdanni-Bud.mjs';
import kdanniPhoto from './getFeedSkeleton/kdanni-Photo.mjs';

const getFeedSkeletonChain = [
    mw000,
    kdanniBud,
    kdanniPhoto,
    zzz
];

router.get('/app.bsky.feed.getFeedSkeleton', getFeedSkeletonChain);

export default router;