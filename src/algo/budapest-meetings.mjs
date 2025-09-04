// import { pool } from './connection/connection.mjs';
import { initFeedCache } from '../redis/init-cache.mjs';


export const shortname = 'budapestMeetings';


export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#📍Budapest Meetings',
      description: '📍Budapest or #Budapest tagged meetings.',
      avatarFile: 'avatars/budapest3.jpg',
    },
  ],
}

// const TARGET_AUTHOR_DID = process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID;
const DEV_ENV = process.env.ENV === 'DEV';
    

export async function runAlgo() {
  await initFeedCache(shortname);
  console.log(`[${shortname}] Cache initialized`);
}
