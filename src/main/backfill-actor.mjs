import { backfillPublisher as backfillFeedPublishersPosts } from '../backfill/backfill-publisher.mjs';
import { backfillFollowed } from '../backfill/backfill-followed.mjs';
import { backfillListed } from '../backfill/backfill-listed.mjs';
import { initCache } from '../algo/cache/init-cache.mjs';

import { runAlgo as kdBud } from '../algo/kdanni-Bud.mjs';
import { runAlgo as kdOutofBud } from '../algo/kdanni-out-of-Bud.mjs';
import { runAlgo as kdBudOutofBud } from '../algo/kdanni-Bud-Out-of-Bud.mjs';
import { runAlgo as kdPhoto } from '../algo/kdanni-Photo.mjs';
import { runAlgo as cf } from '../algo/kdanni-CustomFeed.mjs';
import { runAlgo as musEj } from '../algo/kdanni-MusEj.mjs';


export async function main() {

    // BlueSky API calls
    // Sequential for respect rate limits and quotas

    console.log('[backfill-actor-main] Backfilling feed_publishers_posts');
    try {
        await backfillFeedPublishersPosts();
        await backfillFollowed();
        await backfillListed();
        
        console.log('[backfill-actor-main] Backfilling feed_publishers_posts done');
    } catch (e) {
        console.error('[backfill-actor-main] Backfill Error', e);
    }

    // Run algos
    // Algos select post from bsky_post table and insert into feed_post table no remote API calls
    // Can run in parallel if DB isn't a bottleneck
    
    console.log('[backfill-actor-main] Running algos');
    await Promise.all([
        kdBud(),
        kdOutofBud(),
        kdBudOutofBud(),
        kdPhoto(),
        cf(),
        musEj(),        
    ]).catch((e) => {
        console.error('[backfill-actor-main] Algo Error', e);
    });
    console.log('[backfill-actor-main] Running algos done');
    try {
        await initCache();
    } catch (error) {
        console.error('[backfill-actor-main] Cache Initialization Error:', error);
    }    
}
