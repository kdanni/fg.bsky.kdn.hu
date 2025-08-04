import { backfillSearchRunner, backfillSearchAlgoRunner } from '../backfill/backfill-search.mjs'
import { initCache } from '../algo/cache/init-cache.mjs';


export async function main() {

    // BlueSky API calls
    // Sequential for respect rate limits and quotas

    console.log('[backfill-search-main] Backfilling feed_publishers_posts');
    try {
        await backfillSearchRunner();

        console.log('[backfill-search-main] Backfilling feed_publishers_posts done');
    } catch (e) {
        console.error('[backfill-search-main] Backfill Error', e);
    }

    console.log('[backfill-search-main] Running algos');
    await Promise.all([
        backfillSearchAlgoRunner(),
    ]).catch((e) => {
        console.error('[backfill-search-main] Algo Error', e);
    });
    console.log('[backfill-search-main] Running algos done');
    try {
        await initCache();
    } catch (error) {
        console.error('[backfill-search-main] Cache Initialization Error:', error);
    }
}
