import '../log/event-logger.mjs';
import emitter from '../event-emitter.mjs';
emitter.on('main', () => {/* NOP */ });


import '../jetstream/jetstream-rabbit.mjs';
import { subscribeFollowed, subscribeListed } from '../jetstream/author-event-handlers.mjs';
import '../jetstream/jetstream.mjs';

async function main () {

    await subscribeFollowed();
    await subscribeListed();
}

setTimeout(main, 100); // delay start for 100ms