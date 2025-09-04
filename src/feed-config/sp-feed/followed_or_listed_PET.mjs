export const shortname = 'kd-FL-PET';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni.hu - F + L ::PET',
      description: 'Pet pics. Posts by followed or users on my lists. No replies.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
  shortname,
  commandlineRegex: /(f_l_PET|kd_FL_PET|kdanni-followed-or-listed_PET)$/i,
  TARGET_AUTHOR_DID: `${process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID}`,
}