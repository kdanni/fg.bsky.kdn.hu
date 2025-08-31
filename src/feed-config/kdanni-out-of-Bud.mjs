export const shortname = 'kdanni-out-of-Bud';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni - #OutOfTheCity',
      description: 'My posts with #OutOfTheCity hashtags',
      avatarFile: 'avatars/OutOfTheCity.jpg',
    },
  ],
  shortname,
  commandlineRegex: /(kdanni-out-of-Bud|kd_OoB(ud)?)$/i,
  TARGET_AUTHOR_DID: `${process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID}`,
}