export const shortname = 'rodjiuraHash';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#路地 posts',
      description: '#散歩 #路地裏 #backstreet #backstreetalley tagged posts.',
      avatarFile: 'avatars/rodjiuraHash.png',
    },
  ],
  shortname,
  commandlineRegex: /^rodjiura(Hash)?$/i,
}