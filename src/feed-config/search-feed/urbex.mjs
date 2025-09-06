export const shortname = 'urbex';

export const TAGS = [
    '#urbex',
    '#rurex',
    '#urbanex',
    '#ruralex',
    '#urbanexp',
    '#ruralexp',
    '#urbanexploring',
    '#ruralexploring',
    '#urbanexploration',
    '#ruralexploration',
    '#urbandecay',
    '#ruraldecay',
    '#ruralphotography',
    '#abandoned',
]

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'urbex ruirex images',
      description: `Hashtag included: ${TAGS.join(' ')}`,
      avatarFile: 'avatars/urbex.jpg',
    },
  ],
  shortname,
  commandlineRegex: /urbex$/i,
}