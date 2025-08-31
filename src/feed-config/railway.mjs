export const shortname = 'railway';

export const TAGS = [
    '#railway',
    '#railwayphotography',
    '#tram',
    '#trams',
    '#train',
    '#trains',
    '#tramline',
    '#locomotive',
    '#locomotives',
    '#railwaystation',
    '#railwaytrack',
    '#railwaybridge',
    '#railwaycrossing',
    '#railwayart',
    '#marshallingyard',
    '#marshalyard',
    '#subwayphotography',
    '#subwaystation',
    '#metrophotography',
    '#metrostation',
]

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Railway images 🛤️',
      description: `Hashtag included: ${TAGS.join(' ')}`,
      avatarFile: 'avatars/railway.jpg',
    },
  ],
  shortname,
  commandlineRegex: /railway$/i,
}