import '../log/event-logger.mjs';
import emitter from '../event-emitter.mjs';
emitter.on('main', () => {/* NOP */ });

import { initListedUsers } from '../backfill/backfill-listed.mjs';

import { backfillPublisher as backfillFeedPublishersPosts } from '../backfill/backfill-publisher.mjs';
import { backfillFollowed } from '../backfill/backfill-followed.mjs';
import { backfillListed } from '../backfill/backfill-listed.mjs';
import {initFeedNSFW } from '../redis/init-cache.mjs';

import { backfillSearchRunner, backfillSearchAlgoRunner } from '../backfill/backfill-search.mjs';

import { backfillFavoritesRunner } from '../backfill/backfill-favorites.mjs'

async function mainActor() {
    console.log('[main-backfill actor] Backfilling started');

    await backfillFeedPublishersPosts();
    // await applyCustomFeedLogic();
            
    await backfillFollowed();
    await backfillListed();
    // await applyCustomFeedLogic();

    await initFeedNSFW();

    console.log('[main-backfill actor] Backfilling done');
}

async function mainSearch() {

    console.log('[main-backfill search] Backfilling by search. Started');

    await backfillSearchRunner();

    await backfillSearchAlgoRunner();

    console.log('[main-backfill search] Backfilling by search. Done');
}

async function main() {
   try {
        await initListedUsers();

        await Promise.all([
            mainActor(),
            mainSearch(),
            backfillFavoritesRunner(),
        ]);
    } catch (error) {
        console.error('[main] Backfill Error:', error);
    }

    setTimeout(() => { process.emit('exit_event');}, 1000);

}

setTimeout(main, 1000); // delay start for 1s to wait for the DB connection to be ready