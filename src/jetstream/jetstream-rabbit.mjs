import emitter from "./jetstream-event-emitter.mjs";

import { mq, BSKY_JETSTREAM_EXCHANGE, BSKY_AUTHOR_EXCHANGE } from '../rabbit/amqplib-connection.mjs'

emitter.on('jetstream.post.created', jetstreamPostCreated);

async function jetstreamPostCreated(record) {
    if (mq.ch1) {
        if(record.langs?.length > 0) {
            if(
                record.langs.includes('hu') ||
                record.langs.includes('en') ||
                record.langs.includes('ja') ||
                record.langs.includes('fr')
            ) {
                // OK
            } else {
                return; // Ignore posts in other languages
            }
        }
        mq.ch1.publish(BSKY_JETSTREAM_EXCHANGE, '', Buffer.from(JSON.stringify(record)));
        const { authorDid, uri } = record;
        if (authorDid && uri) {
            mq.ch1.publish(BSKY_AUTHOR_EXCHANGE, '', Buffer.from(JSON.stringify({ authorDid, uri })));
        }
    }    
}