export const shortname = 'lego';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Lego images',
      description: 'A feed of lego images. ',
      avatarFile: 'avatars/lego.jpg',
    },
  ],
  shortname,
  commandlineRegex: /lego$/i,
}