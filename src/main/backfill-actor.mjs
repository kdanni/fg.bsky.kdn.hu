import { backfillPublisher as backfillFeedPublishersPosts } from '../backfill/backfill-publisher.mjs';
import { backfillFollowed } from '../backfill/backfill-followed.mjs';
import { backfillListed } from '../backfill/backfill-listed.mjs';

import {initFeedNSFW } from '../redis/init-cache.mjs';

import { applyCustomFeedLogic } from '../custom-feed/apply-custom-feed-logic.mjs';


export async function main() {

    // BlueSky API calls
    // Sequential for respect rate limits and quotas

    console.log('[backfill-actor-main] Backfilling started');
    try {
        await backfillFeedPublishersPosts();
        await applyCustomFeedLogic();
                
        await backfillFollowed();
        await backfillListed();
        await applyCustomFeedLogic();
        
        
        await initFeedNSFW();
    
        console.log('[backfill-actor-main] Backfilling done');
    } catch (e) {
        console.error('[backfill-actor-main] Backfill Error', e);
    }     
}
