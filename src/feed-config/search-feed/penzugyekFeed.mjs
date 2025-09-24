export const shortname = 'penzugyekFeed';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Pénzügyek posts',
      description: '#Pénzügyek and tagged posts.',
      avatarFile: 'avatars/KozGaz.png',
    },
  ],
  shortname,
  commandlineRegex: /^penzugyek$/i,
}