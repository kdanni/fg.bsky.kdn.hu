export const shortname = 'kdanni-Followed';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni.hu - Followed',
      description: 'Posts by my followed users. No replies. Don\'t have to see my own posts.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
  shortname,
  commandlineRegex: /(followed|kd_f|kd_follow(ed)?|kdanni-Followed)$/i,
  TARGET_AUTHOR_DID: `${process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID}`,
}