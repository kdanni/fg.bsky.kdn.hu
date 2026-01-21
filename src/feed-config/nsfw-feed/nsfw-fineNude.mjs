export const shortname = 'fineNude';
// import { initFeedNSFW } from './cache/init-cache.mjs';

const FEEDGEN_PUBLISHER_DID = process.env.NSFW_FEEDGEN_PUBLISHER_DID || process.env.FEEDGEN_PUBLISHER_DID

export const FEEDGEN_CONFIG = {
  publisherDid: `${FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Fineart nude images',
      description: 'Fineart nude images',
      avatarFile: 'avatars/finenude.png',
    },
  ],
  shortname,
  commandlineRegex: /\bfinenude$/i,
  nsfw:true,
  publisherDid:FEEDGEN_PUBLISHER_DID,
  bskyHandle: process.env.NSFW_REGISTRATION_APP_HANDLE || process.env.REGISTRATION_APP_HANDLE,
  bskyAppPassword:  process.env.NSFW_REGISTRATION_APP_PASSWORD ||  process.env.REGISTRATION_APP_PASSWORD,
}