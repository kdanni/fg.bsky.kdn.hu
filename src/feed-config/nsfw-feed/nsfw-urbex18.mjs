export const shortname = '.urbex18';
// import { initFeedNSFW } from './cache/init-cache.mjs';

const FEEDGEN_PUBLISHER_DID = process.env.NSFW_FEEDGEN_PUBLISHER_DID || process.env.FEEDGEN_PUBLISHER_DID

export const FEEDGEN_CONFIG = {
  publisherDid: `${FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Urbex 🔞 images',
      description: 'NSFW Urbex feed',
      avatarFile: 'avatars/urbex.png',
    },
  ],
  shortname,
  commandlineRegex: /18urbex$/i,
  nsfw:true,
  publisherDid:FEEDGEN_PUBLISHER_DID,
  bskyHandle: process.env.NSFW_REGISTRATION_APP_HANDLE || process.env.REGISTRATION_APP_HANDLE,
  bskyAppPassword:  process.env.NSFW_REGISTRATION_APP_PASSWORD ||  process.env.REGISTRATION_APP_PASSWORD,
}