export const shortname = 'popartImages';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#popart images',
      description: '#popart hashtagged posts with images.',
      avatarFile: 'avatars/popart.png',
    },
  ],
  shortname,
  commandlineRegex: /\bpopartimages$/i,
}