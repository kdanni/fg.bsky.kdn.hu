import { backfillPublisher as backfillFeedPublishersPosts } from '../backfill/backfill-publisher.mjs';
import { backfillFollowed } from '../backfill/backfill-followed.mjs';
import { backfillListed } from '../backfill/backfill-listed.mjs';

import {initFeedCache, initFeedNSFW} from '../algo/cache/init-cache.mjs';
import { shortname as FL } from '../algo/followed_or_listed.mjs';
import { shortname as F } from '../algo/followed.mjs';
import { shortname as L } from '../algo/listed.mjs';

import { runAlgo as kdBud } from '../algo/kdanni-Bud.mjs';
import { runAlgo as kdOutofBud } from '../algo/kdanni-out-of-Bud.mjs';
import { runAlgo as kdBudOutofBud } from '../algo/kdanni-Bud-Out-of-Bud.mjs';
import { runAlgo as kdPhoto } from '../algo/kdanni-Photo.mjs';
import { runAlgo as cf } from '../algo/kdanni-CustomFeed.mjs';
import { runAlgo as musEj } from '../algo/kdanni-MusEj.mjs';


export async function main() {

    // BlueSky API calls
    // Sequential for respect rate limits and quotas

    console.log('[backfill-actor-main] Backfilling started');
    try {
        await backfillFeedPublishersPosts();
        await Promise.all([
            kdBud(),
            kdOutofBud(),
            kdBudOutofBud(),
            kdPhoto(),
            cf(),
            musEj(),
        ]);
        
        await backfillFollowed();
        // await initFeedCache(F);

        await backfillListed();
        // await initFeedCache(L);
        // await initFeedCache(FL);
        await initFeedNSFW();
    
        console.log('[backfill-actor-main] Backfilling done');
    } catch (e) {
        console.error('[backfill-actor-main] Backfill Error', e);
    }     
}
