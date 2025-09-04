export const shortname = 'budapestHashtag';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Budapest images',
      description: '#Budapest posts with images.',
      avatarFile: 'avatars/budapest2.jpg',
    },
  ],
  shortname,
  commandlineRegex: /(budapestHashtag|bud_hash)$/i,
}