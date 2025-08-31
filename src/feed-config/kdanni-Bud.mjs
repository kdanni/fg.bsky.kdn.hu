export const shortname = 'kdanni.hu-Bud';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni.hu - #Budapest',
      description: 'My posts with #Budapest or #Danube hashtags',
      avatarFile: 'avatars/budapest.jpg',
    },
  ],
  shortname,
  commandlineRegex: /(kdanni-Bud(apest)?|kdBud|kd_bud)$/i,
  TARGET_AUTHOR_DID: `${process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID}`,
}