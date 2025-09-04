export const shortname = 'kd-Follow-Listd';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni.hu - F + L',
      description: 'Posts by followed or users on my lists. No replies.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
  shortname,
  commandlineRegex: /(f_l|kd_FL|kdanni-followed-or-listed)$/i,
  TARGET_AUTHOR_DID: `${process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID}`,
}