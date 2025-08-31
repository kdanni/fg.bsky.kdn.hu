export const shortname = 'kdanni-Listed';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni.hu - Listed',
      description: 'Posts by users on my list. No replies.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
  shortname,
  commandlineRegex: /((kd_)?listed)$/i,
  TARGET_AUTHOR_DID: `${process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID}`,
}