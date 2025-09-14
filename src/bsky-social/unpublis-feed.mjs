// import got from 'got';
// import { getAuthToken } from './auth.mjs';
import fs from 'fs/promises'

import { AtpAgent, AppBskyFeedDefs } from '@atproto/api'

// const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const BSKY_SOCIAL_ROOT = process.env.BSKY_SOCIAL_ROOT || 'https://bsky.social';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

const REGISTRATION_APP_HANDLE = process.env.REGISTRATION_APP_HANDLE;
const REGISTRATION_APP_PASSWORD = process.env.REGISTRATION_APP_PASSWORD;

const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;
const FEEDGEN_HOSTNAME = process.env.FEEDGEN_HOSTNAME;


export async function unpublishFeed(feedGenConfig){
    try {
        console.log('[UnpublishFeed] Starting...')

        const handle = feedGenConfig.bskyHandle || REGISTRATION_APP_HANDLE;
        const password = feedGenConfig.bskyAppPassword || REGISTRATION_APP_PASSWORD;
        
        const service = feedGenConfig.bskyService || BSKY_SOCIAL_ROOT;

        const agent = new AtpAgent({ service });
        await agent.login({ identifier: handle, password})


        const publisherDid = feedGenConfig.publisherDid || FEEDGEN_PUBLISHER_DID;

        for(const feed of feedGenConfig.feeds || []) {
            const recordName = feed.id;

            console.log('[UnpublishFeed] recordName', recordName);
                        
            await agent.com.atproto.repo.deleteRecord({
                repo: publisherDid,
                collection: 'app.bsky.feed.generator',
                rkey: recordName,
            })
        }

        console.log('[UnpublishFeed] All done 🎉')
    } catch (error) {
        console.error("[UnpublishFeed] ERROR", error);
    }
}

