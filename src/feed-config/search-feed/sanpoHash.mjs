export const shortname = 'sanpoHash';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#散歩 posts',
      description: '#散歩 tagged posts.',
      avatarFile: 'avatars/sanpoHash.png',
    },
  ],
  shortname,
  commandlineRegex: /^sanpo(Hash)?$/i,
}