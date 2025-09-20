import '../log/event-logger.mjs';
import emitter from '../event-emitter.mjs';
emitter.on('main', () => {/* NOP */ });

import { initListedUsers } from '../backfill/backfill-listed.mjs';

import { jsBackfillNsfw } from '../jetstream/js-backfill-nsfw.mjs';

async function main () {

    await initListedUsers();

    await jsBackfillNsfw();


    setTimeout(() => {process.emit('exit_event')}, 1000);
}

setTimeout(main, 100); // delay start for 100ms