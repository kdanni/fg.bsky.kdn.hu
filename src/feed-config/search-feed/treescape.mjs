export const shortname = 'treescape';

export const TAGS = [
    '#treescape',
    '#treescapephotography',
    '#hiking',
    '#hikingtrail',
    '#tree',
    '#trees',
    '#forest',
    '#cactus',
    '#palm',
    '#palmtree',
    '#palmtrees',
    '#park',
]

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Treescape images',
      description: `Hashtag included: ${TAGS.join(' ')}`,
      avatarFile: 'avatars/treescape.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\btreescape$/i,
}
