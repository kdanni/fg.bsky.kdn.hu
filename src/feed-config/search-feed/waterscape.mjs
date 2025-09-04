export const shortname = 'waterscape';

export const TAGS = [
    '#waterscape',
    '#waterscapephotography',
    '#dockyard',
    '#dockyardphotography',
    '#dockphotography',
    '#boatyard',
    '#boatyardphotography',
    '#marinaphotography',
    '#harbor',
    '#harborphotography',
    '#harborlife',
    '#waterfall',
    '#waterfallphotography',
    '#lakescape',
    '#lakephotography',
    '#riverphotography',
    '#seaphotography',
    '#oceanphotography',
    '#riverscape',
    '#seascape',
    '#oceanscape',
]

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Waterscape images',
      description: `Hashtag included: ${TAGS.join(' ')}`,
      avatarFile: 'avatars/waterscape.jpg',
    },
  ],
  shortname,
  commandlineRegex: /waterscape$/i,
}