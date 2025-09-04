export const shortname = 'notUrbanEx';

export const TAGS = [
    '#urbandecay',
    '#urbangaze',
    '#urbanlandscape',
    '#suburbangaze',
    '#cityscape',
    '#bridge',
    '#architecture',
    '#oldbuildings',
    '#industrial',
    '#powerpole',
    '#nightscape',
    '#skyline',
    '#dam',
    '#weathered',
    '#lighthouse',
]

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Not UrbanEx images',
      description: `Hashtag included: ${TAGS.join(' ')}`,
      avatarFile: 'avatars/notUrbanEx.jpg',
    },
  ],
  shortname,
  commandlineRegex: /notUrbanEx$/i,
}