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


export async function updateFeed(feedGenConfig){
    try {
        console.log('[UpdateFeed] Starting...')

        const handle = feedGenConfig.bskyHandle || REGISTRATION_APP_HANDLE;
        const password = feedGenConfig.bskyAppPassword || REGISTRATION_APP_PASSWORD;
        
        const service = feedGenConfig.bskyService || BSKY_SOCIAL_ROOT;
        const publisherDid = feedGenConfig.publisherDid || FEEDGEN_PUBLISHER_DID;

        const agent = new AtpAgent({ service });
        await agent.login({ identifier: handle, password});

        const feedsInRepo = await listFeedGenerator(agent) || [];

        for(const feed of feedGenConfig.feeds || []) {
            const feedGenDid = `did:web:${FEEDGEN_HOSTNAME}`;
            const recordName = feed.id;
            const displayName = feed.displayName;
            const description = feed.description;
            const avatarFile = feed.avatarFile || null;

            // console.log('[UpdateFeed] feedGenDid', feedGenDid);
            // console.log('[UpdateFeed] recordName', recordName);
            // console.log('[UpdateFeed] displayName', displayName);
            // console.log('[UpdateFeed] description', description);
            // console.log('[UpdateFeed] avatarFile', avatarFile);

            let skip = true;
            let feedInRepo = null;
            for(const fir of feedsInRepo || []) {
                if(`${fir}`.endsWith(recordName)) {
                    skip = false;
                    break;
                }
            }
            if(skip){
                console.log('[UpdateFeed] !! already published, skipping.');                    
                continue;
            }

            feedInRepo = await agent.com.atproto.repo.getRecord({
                repo: publisherDid,
                collection: 'app.bsky.feed.generator',
                rkey: recordName
            })
            // feedInRepo = feedInRepo?.data;
            
            DEV_ENV && console.dir(feedInRepo, {depth:null});
            
            if(!feedInRepo || !feedInRepo.success || !feedInRepo.data) {
                console.dir(feedInRepo, {depth:null});
                continue;
            }
            const value = feedInRepo.data.value;
            if(!value) {
                console.dir(feedInRepo, {depth:null});
                continue;
            }
            
            let avatarRef = value.avatar;
            if(feed.updateAvatarFile) {
                avatarRef = await uploadAvatar(agent, avatarFile);
            }

            console.log('[UpdateFeed] feedGenDid', value.did , feedGenDid);
            console.log('[UpdateFeed] recordName', feedInRepo.data.uri, recordName);
            console.log('[UpdateFeed] displayName', value.displayName, displayName);
            console.log('[UpdateFeed] description', value.description, description);
            console.log('[UpdateFeed] avatarFile', avatarFile, `config.updateAvatarFile: ${feed.updateAvatarFile}`);
            
            await agent.com.atproto.repo.putRecord({
                repo: publisherDid,
                collection: 'app.bsky.feed.generator',
                rkey: recordName,
                record: {
                    did: value.did,
                    displayName: displayName,
                    description: description,
                    avatar: avatarRef,
                    createdAt: value.createdAt,
                    contentMode: AppBskyFeedDefs.CONTENTMODEUNSPECIFIED,
                },
            })
        }

        console.log('[UpdateFeed] All done 🎉')
    } catch (error) {
        console.error("[UpdateFeed] ERROR", error);
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