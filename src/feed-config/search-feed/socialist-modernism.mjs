export const shortname = 'SocialistModernism';

export const TAGS = [
    '#SocialistModernism',
    '#SocialistArchitecture',
    '#Socialistheritage',
    '#SoCHeritage',
    '#CommunistArchitecture',
    '#CommunistModernism',
    '#Communistheritage',
    '#Plattenbau',    
]

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#SocialistModernism 🏢',
      description: `Hashtag included: ${TAGS.join(' ')}`,
      avatarFile: 'avatars/socialist-modernism.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\b(socialistmodernism|SM)$/i,
}