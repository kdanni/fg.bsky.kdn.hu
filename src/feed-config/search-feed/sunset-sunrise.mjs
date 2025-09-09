export const shortname = 'sunsetSunrise';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Sunset #Sunrise images',
      description: '#Sunset #Sunrise post with images.',
      avatarFile: 'avatars/sunset.jpg',
    },
  ],
  shortname,
  commandlineRegex: /sunset$/i,
}