export const shortname = 'hunSkyHash';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#HunSky posts',
      description: '#HunSky and #huntwitter tagged posts.',
      avatarFile: 'avatars/magyaro.jpg',
    },
  ],
  shortname,
  commandlineRegex: /^hunsky$/i,
}