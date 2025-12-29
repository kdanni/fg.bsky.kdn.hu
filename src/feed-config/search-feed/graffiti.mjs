export const shortname = 'graffiti';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#graffiti images',
      description: '#graffiti & #streetart posts with images.',
      avatarFile: 'avatars/graffiti.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\bgraffiti$/i,
}