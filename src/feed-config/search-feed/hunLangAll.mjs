export const shortname = 'hunSkyHash';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Hu-Lang posts 🇭🇺',
      description: '🇭🇺 Hungarian language posts. \nMagyar nyelvű postok.',
      avatarFile: 'avatars/magyaro.jpg',
    },
  ],
  shortname,
  commandlineRegex: /^hunLangAll$/i,
}