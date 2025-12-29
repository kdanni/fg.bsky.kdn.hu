export const shortname = 'magyaroHashtag';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Magyarország 🇭🇺',
      description: '#Magyarország or #magyar posts.',
      avatarFile: 'avatars/magyaro.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\bmagyaro(_hash)?$/i,
}