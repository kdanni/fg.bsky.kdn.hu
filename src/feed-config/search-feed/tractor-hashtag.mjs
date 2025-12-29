export const shortname = 'tractorHashtag';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Tractor 🚜',
      description: '#tractor posts.',
      avatarFile: 'avatars/tractor.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\btractor$/i,
}