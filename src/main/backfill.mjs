import { backfillPublisher as backfillFeedPublishersPosts } from '../backfill/backfill-publisher.mjs';
import { backfillFollowed } from '../backfill/backfill-followed.mjs';


import { runAlgo as kdBud } from '../algo/kdanni-Bud.mjs';
import { runAlgo as kdPhoto } from '../algo/kdanni-Photo.mjs';

async function main() {

    // BlueSky API calls
    // Sequential for respect rate limits and quotas

    console.log('[backfill-main] Backfilling feed_publishers_posts');
    try {
        await backfillFeedPublishersPosts();
        await backfillFollowed();


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
        kdPhoto()
    ]).catch((e) => {
        console.error('[backfill-main] Algo Error', e);
    });
    console.log('[backfill-main] Running algos done');

    setTimeout(() => { process.emit('exit_event') }, 1000);
}


(async () => {
    setTimeout(main, 1000);
})();