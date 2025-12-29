export const shortname = 'fungiImages';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Fungi images',
      description: `Fungi and mushrooms images`,
      avatarFile: 'avatars/fungi.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\bfungiImages$/i,
}