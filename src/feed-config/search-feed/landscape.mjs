export const shortname = 'landscape';

export const TAGS = [
    '#landscape',
    '#landscapephotography',
    '#ruralphotography',
    '#abandoned',
    '#sunset',
    '#sunrise',
    '#haybale',
    '#haybales',
    '#haystack',
    '#desert',
]

const tagsRegexArray = TAGS.map(tag => `${tag}\\b`).join('|');

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Landscape images',
      description: `Hashtag included: ${TAGS.join(' ')}`,
      avatarFile: 'avatars/landscape.jpg',
    },
  ],
  shortname,
  commandlineRegex: /landscape$/i,
}