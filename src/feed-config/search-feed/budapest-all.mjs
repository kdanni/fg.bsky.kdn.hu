export const shortname = 'budapestAll';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#📍Budapest posts',
      description: '📍Budapest or #Budapest tagged posts.',
      avatarFile: 'avatars/budapest3.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\bbudapest-all$/i,
}