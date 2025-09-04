export const shortname = 'kdanni.hu-Photo';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni.hu - #Photo',
      description: 'My posts with #phototgraphy hashtags, no #photo but #photography was to long for displayname.',
      avatarFile: 'avatars/camera.jpg',
    },
  ],
  shortname,
  commandlineRegex: /(kd_?Photo)$/i,
  TARGET_AUTHOR_DID: `${process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID}`,
}