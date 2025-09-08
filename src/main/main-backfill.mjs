import '../log/event-logger.mjs';
import emitter from '../event-emitter.mjs';
emitter.on('main', () => {/* NOP */ });

import { initListedUsers } from '../backfill/backfill-listed.mjs';

import { main as actor } from './backfill-actor.mjs';
import { main as search } from './backfill-search.mjs';
import { main as favorites } from './backfill-favorites.mjs';

async function main() {

    await initListedUsers();

    /**
     * Main data collection logic.
     * Get data from BlueSky and store it in the database.
     * Then algos select posts for the custom feeds.
     * 
     * After run the app will terminates.
     */

    try {
        await Promise.all([
            actor(),
            search(),
            favorites(),
        ]);
    } catch (error) {
        console.error('[main] Backfill Error:', error);
    }

    setTimeout(() => { process.emit('exit_event');}, 1000);

}

setTimeout(main, 1000); // delay start for 1s to wait for the DB connection to be ready