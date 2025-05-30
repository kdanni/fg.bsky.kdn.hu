import { backfillPublisher as backfillFeedPublishersPosts } from '../backfill/backfill-publisher.mjs';
import { backfillFollowed } from '../backfill/backfill-followed.mjs';
import { backfillListed } from '../backfill/backfill-listed.mjs';
import { backfillSearchRunner } from '../backfill/backfill-search.mjs'


import { runAlgo as kdBud } from '../algo/kdanni-Bud.mjs';
import { runAlgo as kdPhoto } from '../algo/kdanni-Photo.mjs';
import { runAlgo as budTag } from '../algo/budapest-hashtag.mjs';
import { runAlgo as moTag } from '../algo/magyarorszag-hashtag.mjs';
import { runAlgo as cf } from '../algo/kdanni-CustomFeed.mjs';

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

    console.log('[backfill-main] Running algos');
    await Promise.all([
        kdBud(),
        kdPhoto(),
        budTag(),
        moTag(),
        cf(),
    ]).catch((e) => {
        console.error('[backfill-main] Algo Error', e);
    });
    console.log('[backfill-main] Running algos done');

    setTimeout(() => { process.emit('exit_event') }, 1000);
}


(async () => {
    setTimeout(main, 1000);
})();