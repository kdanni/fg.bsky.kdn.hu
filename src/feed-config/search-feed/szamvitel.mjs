export const shortname = 'szamvitel';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Számvitel posts',
      description: '#Számvitel and tagged posts.',
      avatarFile: 'avatars/KozGaz.png',
    },
  ],
  shortname,
  commandlineRegex: /^szamvitel$/i,
}