export const shortname = 'kdn-CustomFeed';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni.hu - #CustomFeed',
      description: 'My custom feed announcements.',
      avatarFile: 'avatars/sky.jpg',
    },
  ],
  shortname,
  commandlineRegex: /(kd_?CustomFeed)$/i,
  TARGET_AUTHOR_DID: `${process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID}`,
}