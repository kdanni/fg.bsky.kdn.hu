export const shortname = 'snowscape';

export const TAGS = [
    '#snowscape',
    '#snowhotography',
    '#winterscape',
    '#winterphotography',
    '#icescape',
]

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Snowscape images',
      description: `Hashtag included: ${TAGS.join(' ')}`,
      avatarFile: 'avatars/snowscape.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\bsnowscape$/i,
}