// import got from 'got';
// import { getAuthToken } from './auth.mjs';
// import fs from 'fs/promises'

import { AtpAgent, AppBskyFeedDefs } from '@atproto/api'

// const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const BSKY_SOCIAL_ROOT = process.env.BSKY_SOCIAL_ROOT || 'https://bsky.social';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

const REGISTRATION_APP_HANDLE = process.env.REGISTRATION_APP_HANDLE;
const REGISTRATION_APP_PASSWORD = process.env.REGISTRATION_APP_PASSWORD;

const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;
const FEEDGEN_HOSTNAME = process.env.FEEDGEN_HOSTNAME;


export async function listFeedGenerator(agent, feedGenConfig){
    const retArray = [];
    try {
        feedGenConfig = feedGenConfig || {};
        DEV_ENV && console.log('[listFeedGenerator] Starting...')

        const handle = feedGenConfig.bskyHandle || REGISTRATION_APP_HANDLE;
        const password = feedGenConfig.bskyAppPassword || REGISTRATION_APP_PASSWORD;
        
        const service = feedGenConfig.bskyService || BSKY_SOCIAL_ROOT;

        agent = agent || new AtpAgent({ service });
        await agent.login({ identifier: handle, password})


        const publisherDid = feedGenConfig.publisherDid || FEEDGEN_PUBLISHER_DID;

        let cursor = null;

        while (cursor !== undefined) {
            const response = await agent.com.atproto.repo.listRecords({
                repo: publisherDid,
                collection: 'app.bsky.feed.generator',            
            })
            // console.dir(response);
            const { data } = response;
            DEV_ENV && console.log('[listFeedGenerator] cursor:', data.cursor);
            if(cursor === data.cursor) {
                cursor = undefined;
                break;        
            }

            for(const record of data.records || []) {

                DEV_ENV && console.log('[listFeedGenerator] rekord', record.uri);
                DEBUG && console.dir(record, {depth:2});

                retArray.push(`${record.uri}`);
            }            
        
            if(cursor !== undefined) {
                cursor = data.cursor
                await new Promise((resolve) => { setTimeout( resolve , 1000 );});
            }
        } // END while loop
        console.log('[listFeedGenerator] All done.');
    } catch (error) {
        console.error("[listFeedGenerator] ERROR", error);
    }
    return retArray;
}
