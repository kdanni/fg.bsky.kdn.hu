// import { pool } from './connection/connection.mjs';


export const shortname = 'nsfw-Listed';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'NSFW listed 🔞',
      description: 'I assume you working in a conservative environment.',
      avatarFile: 'avatars/nsfw.png',
    },
  ],
}


const TARGET_AUTHOR_DID = process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID;
// const DEV_ENV = process.env.ENV === 'DEV';
    

export async function runAlgo(authorDid, listName) {    
    // NOP
}