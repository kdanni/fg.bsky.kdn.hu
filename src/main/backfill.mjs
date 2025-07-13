import { backfillPublisher as backfillFeedPublishersPosts } from '../backfill/backfill-publisher.mjs';
import { backfillFollowed } from '../backfill/backfill-followed.mjs';
import { backfillListed } from '../backfill/backfill-listed.mjs';
import { backfillSearchRunner } from '../backfill/backfill-search.mjs'
import { initCache } from '../algo/cache/init-cache.mjs';

import { runAlgo as kdBud } from '../algo/kdanni-Bud.mjs';
import { runAlgo as kdPhoto } from '../algo/kdanni-Photo.mjs';
import { runAlgo as budTag } from '../algo/budapest-hashtag.mjs';
import { runAlgo as moTag } from '../algo/magyarorszag-hashtag.mjs';
import { runAlgo as cf } from '../algo/kdanni-CustomFeed.mjs';
import { runAlgo as tractor } from '../algo/tractor-hashtag.mjs';
import { runAlgo as notUrbanEx } from '../algo/not-urban-ex.mjs';
import { runAlgo as musEj } from '../algo/kdanni-MusEj.mjs';
import { runAlgo as brutalism } from '../algo/brutalism-hashtag.mjs';
import { runAlgo as sm } from '../algo/socialist-modernism.mjs';
import { runAlgo as food } from '../algo/food-images.mjs';

let algosOver = false;
let finalPartOver = false;

async function main() {

    // BlueSky API calls
    // Sequential for respect rate limits and quotas

    console.log('[backfill-main] Backfilling feed_publishers_posts');
    try {
        await backfillFeedPublishersPosts();
        await backfillFollowed();
        await backfillListed();
        await backfillSearchRunner();

        console.log('[backfill-main] Backfilling feed_publishers_posts done');
    } catch (e) {
        console.error('[backfill-main] Backfill Error', e);
    }

    // Run algos
    // Algos select post from bsky_post table and insert into feed_post table no remote API calls
    // Can run in parallel if DB isn't a bottleneck

    finalPart();

    console.log('[backfill-main] Running algos');
    await Promise.all([
        kdBud(),
        kdPhoto(),
        budTag(),
        moTag(),
        cf(),
        tractor(),
        notUrbanEx(),
        musEj(),
        brutalism(),
        sm(),
        food(),
    ]).catch((e) => {
        console.error('[backfill-main] Algo Error', e);
    });
    console.log('[backfill-main] Running algos done');
    try {
        await initCache();
    } catch (error) {
        console.error('[backfill-main] Cache Initialization Error:', error);
    }    
    algosOver = true;
    doExit();
}
async function finalPart() {
    await backfillFollowed();    
    finalPartOver = true;
    doExit();
}
async function doExit() {    
    if (!algosOver || !finalPartOver) {
        console.log('[backfill-main] Waiting for algos and final part to finish');
        return;
    }
    setTimeout(() => { process.emit('exit_event') }, 1000);
}

(async () => {
    setTimeout(main, 1000);
})();