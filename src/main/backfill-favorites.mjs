import { backfillFavoritesRunner } from '../backfill/backfill-favorites.mjs'

export async function main() {

    // BlueSky API calls
    // Sequential for respect rate limits and quotas

    console.log('[backfill-favorites-main] Backfilling favorites.');
    try {
        await backfillFavoritesRunner();

        console.log('[backfill-favorites-main] Backfilling favorites done.');
    } catch (e) {
        console.error('[backfill-favorites-main] Backfill Error', e);
    }
}
