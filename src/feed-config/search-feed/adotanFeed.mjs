export const shortname = 'adotanFeed';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Adótan posts',
      description: '#Adótan and tagged posts.',
      avatarFile: 'avatars/KozGaz.png',
    },
  ],
  shortname,
  commandlineRegex: /^adotan$/i,
}