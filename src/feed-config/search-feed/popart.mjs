export const shortname = 'popartHash';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#popart hashtag',
      description: '#popart hashtagged posts.',
      avatarFile: 'avatars/popart.png',
    },
  ],
  shortname,
  commandlineRegex: /\bpopart$/i,
}