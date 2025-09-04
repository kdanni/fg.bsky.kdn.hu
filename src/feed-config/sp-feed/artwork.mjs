export const shortname = 'artwork';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Artwork images',
      description: 'A feed of artwork images. ',
      avatarFile: 'avatars/kdn-art.jpg',
    },
  ],
  shortname,
  commandlineRegex: /artwork$/i,
}