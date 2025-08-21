import emitter from './jetstream-event-emitter.mjs';
import authorDidEmitter from './author-did-event-emitter.mjs';

import WebSocket from 'ws';  // using the 'ws' package for Node.js WebSocket

// Connect to Bluesky JetStream (posts only)
const ws = new WebSocket('wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post');

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

let lastPostMillis = new Date().getTime();


ws.on('open', () => {
  console.log('✅ Connected to Bluesky firehose (posts stream)');
});

ws.on('message', (data) => {
  try {
    // Parse the incoming message (it's JSON text in JetStream)
    const event = JSON.parse(data);
    if (event.kind === 'commit' && event.commit) {
      const commit = event.commit;
      // Check that this is a newly created post in the feed
      if (commit.operation === 'create' && commit.collection === 'app.bsky.feed.post') {
        if (commit.record?.reply?.parent?.uri) {
          // console.log(`New reply by ${event.did}: ${commit.record.text}`);
          return;
        }
        if (commit.record) {
          commit.record.authorDid = event.did; // Add author DID to the record
          commit.record.uri = `at://${event.did}/${event.commit.collection}/${event.commit.rkey}`;
          emitter.emit('jetstream.post.created', commit.record);
          // emitter.emit('jetstream.post.created', event);
          authorDidEmitter.emit(event.did, commit.record);
          if (DEBUG) {
            const currentMillis = new Date().getTime();
            if (currentMillis - lastPostMillis > 10000) {
                // If the last post was more than 10 seconds ago, process this one
                lastPostMillis = currentMillis;
                console.dir(commit.record, { depth: null });
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error parsing firehose message:', err);
    setTimeout(() => { process.emit('exit_event_1') }, 1000);
  }
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
  setTimeout(() => { process.emit('exit_event_1') }, 1000);
});

ws.on('close', () => {
  console.log('Connection to firehose closed');
});
