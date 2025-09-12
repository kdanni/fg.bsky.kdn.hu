import '../log/event-logger.mjs';
import emitter from '../event-emitter.mjs';
emitter.on('main', () => {/* NOP */ });

import { initListedUsers } from '../backfill/backfill-listed.mjs';
import { backfillSearchRunner, backfillSearchAlgoRunner } from '../backfill/backfill-search.mjs';
import { backfillSearchPooled } from '../backfill/backfill-search-pooled.mjs';

const SEARCH_APP_CREDENTIALS_POOL = process.env.SEARCH_APP_CREDENTIALS_POOL;

export async function main() {
    console.log('[backfill-search-main] Backfilling by search.');
    if(!SEARCH_APP_CREDENTIALS_POOL){
        try {
            await initListedUsers();
            
            await backfillSearchRunner();
            
            console.log('[backfill-search-main] Backfilling by search done.');
            
            console.log('[backfill-search-main] Running algos');
            await backfillSearchAlgoRunner();
            console.log('[backfill-search-main] Running algos done');    

        } catch (e) {
            console.error('[backfill-search-main] Backfill Error', e);
        }
    } else {
        try {
            await initListedUsers();
            
            await backfillSearchPooled(SEARCH_APP_CREDENTIALS_POOL);
            
            console.log('[backfill-search-main] Backfilling by search done.');
        } catch (e) {
            console.error('[backfill-search-main] Backfill Error', e);
        }
    }
}
