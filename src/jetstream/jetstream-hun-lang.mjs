import emitter from "./jetstream-event-emitter.mjs";

import { upsertPost } from '../post-process/upsert-post.mjs';
import { runAlgo } from '../algo/hunLang.mjs';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

emitter.on('jetstream.post.created', jetstreamPostCreated);

async function jetstreamPostCreated(record) {
        if(record.langs?.length > 0) {
            if(
                record.langs.includes('hu')
            ) {
                
                console.log(`[jetstream handleEvent HUN] New event for hu lang.`);
                DEBUG && console.dir(record, { depth: null });
        
        
                const item = { post : { record } };
                // item?.post?.record?.embed
                item.post.uri = record.uri;
                item.post.cid = 'jetstream::' + record.cid;
                item.post.indexedAt = new Date(record.createdAt || record.indexedAt || new Date());
        
                await upsertPost(item);

                await runAlgo();
            } else {
                return; // Ignore posts in other languages
            }
        }
}