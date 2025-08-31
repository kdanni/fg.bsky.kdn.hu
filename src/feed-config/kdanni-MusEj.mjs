export const shortname = 'kdanni-MusEj';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdn #MúzeumokÉjszakája🏛️',
      description: 'My posts with #MúzeumokÉjszakája hashtags',
      avatarFile: 'avatars/musej.jpg',
    },
  ],
  shortname,
  commandlineRegex: /((kd_)?musEj)$/i,
  TARGET_AUTHOR_DID: `${process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID}`,
}