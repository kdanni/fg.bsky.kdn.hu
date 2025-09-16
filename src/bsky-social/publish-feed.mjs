// import got from 'got';
// import { getAuthToken } from './auth.mjs';
import fs from 'fs/promises'

import { AtpAgent, AppBskyFeedDefs } from '@atproto/api'

import { listFeedGenerator } from './repo.listRecords.mjs';

// const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const BSKY_SOCIAL_ROOT = process.env.BSKY_SOCIAL_ROOT || 'https://bsky.social';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

const REGISTRATION_APP_HANDLE = process.env.REGISTRATION_APP_HANDLE;
const REGISTRATION_APP_PASSWORD = process.env.REGISTRATION_APP_PASSWORD;

const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;
const FEEDGEN_HOSTNAME = process.env.FEEDGEN_HOSTNAME;


export async function publishFeed(feedGenConfig){
    try {
        console.log('[PublishFeed] Starting...')

        const handle = feedGenConfig.bskyHandle || REGISTRATION_APP_HANDLE;
        const password = feedGenConfig.bskyAppPassword || REGISTRATION_APP_PASSWORD;
        
        const service = feedGenConfig.bskyService || BSKY_SOCIAL_ROOT;
        const publisherDid = feedGenConfig.publisherDid || FEEDGEN_PUBLISHER_DID;

        const agent = new AtpAgent({ service });
        await agent.login({ identifier: handle, password});

        const feedsInRepo = await listFeedGenerator(agent, feedGenConfig) || [];

        for(const feed of feedGenConfig.feeds || []) {
            const feedGenDid = `did:web:${FEEDGEN_HOSTNAME}`;
            const recordName = feed.id;
            const displayName = feed.displayName;
            const description = feed.description;
            const avatarFile = feed.avatarFile || null;

            console.log('[PublishFeed] handle', handle);
            console.log('[PublishFeed] passwd', password);
            console.log('[PublishFeed] feedGenDid', feedGenDid);
            console.log('[PublishFeed] recordName', recordName);
            console.log('[PublishFeed] displayName', displayName);
            console.log('[PublishFeed] description', description);
            console.log('[PublishFeed] avatarFile', avatarFile);

            let skip = false;
            for(const fir of feedsInRepo || []) {
                if(`${fir}`.endsWith(recordName)) {
                    skip = true;
                    break;
                }
            }
            if(skip){
                console.log('[PublishFeed] !! already published, skipping.');                    
                continue;
            }

            const avatarRef = await uploadAvatar(agent, avatarFile);

            await agent.com.atproto.repo.putRecord({
                repo: publisherDid,
                collection: 'app.bsky.feed.generator',
                rkey: recordName,
                record: {
                    did: feedGenDid,
                    displayName: displayName,
                    description: description,
                    avatar: avatarRef,
                    createdAt: new Date().toISOString(),
                    contentMode: AppBskyFeedDefs.CONTENTMODEUNSPECIFIED,
                },
            })
        }

        console.log('[PublishFeed] All done 🎉')
    } catch (error) {
        console.error("[PublishFeed] ERROR", error);
    }
}

async function uploadAvatar(agent, avatar) {
    let avatarRef
    if (avatar) {
        let encoding
        if (avatar.endsWith('png')) {
            encoding = 'image/png'
        } else if (avatar.endsWith('jpg') || avatar.endsWith('jpeg')) {
            encoding = 'image/jpeg'
        } else {
            throw new Error('expected png or jpeg')
        }
        const img = await fs.readFile(avatar)
        const blobRes = await agent.api.com.atproto.repo.uploadBlob(img, {
            encoding,
        })
        avatarRef = blobRes.data.blob
    }
    return avatarRef;
}