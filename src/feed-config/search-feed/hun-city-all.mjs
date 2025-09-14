export const shortname = 'hunVaros';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#📍Hungarian cities',
      description: '📍HungarianCities or #HungarianCities tagged posts.',
      avatarFile: 'avatars/magyaro2.jpg',
    },
  ],
  shortname,
  commandlineRegex: /^hun(garian)?-cit(ies|y)$/i,
}