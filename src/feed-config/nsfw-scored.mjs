export const shortname = 'nsfw-Scored';
// import { initFeedNSFW } from './cache/init-cache.mjs';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'NSFW Scored 🔞',
      description: 'Not safe for work filtered from custom feeds. I assume you working in a conservative environment.',
      avatarFile: 'avatars/nsfw.png',
    },
  ],
  shortname,
  commandlineRegex: /nsfw$/i,
}