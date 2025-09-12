import '../log/event-logger.mjs';
import emitter from '../event-emitter.mjs';
emitter.on('main', () => {/* NOP */ });

import { initListedUsers } from '../backfill/backfill-listed.mjs';
import { backfillFavoritesRunner } from '../backfill/backfill-favorites.mjs'

export async function main() {
    console.log('[backfill-favorites-main] Backfilling favorites.');
    try {
        await initListedUsers();

        await backfillFavoritesRunner();

        console.log('[backfill-favorites-main] Backfilling favorites done.');
    } catch (e) {
        console.error('[backfill-favorites-main] Backfill Error', e);
    }
}
