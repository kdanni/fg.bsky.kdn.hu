export const shortname = 'kozgazdasagtan';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Közgazdaságtan posts',
      description: '#Közgazdaságtan and #KözGáz tagged posts.',
      avatarFile: 'avatars/KozGaz.png',
    },
  ],
  shortname,
  commandlineRegex: /^kozgaz(dasagtan)?$/i,
}