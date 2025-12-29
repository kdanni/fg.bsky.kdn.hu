export const shortname = 'brutalisHashtag';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Brutalism 🏢',
      description: '#brutalism #brutalist #BrutaliSky posts.',
      avatarFile: 'avatars/brutal.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\bbrutalis[mt]$/i,
}