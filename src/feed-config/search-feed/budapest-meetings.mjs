export const shortname = 'budapestMeetings';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#📍Budapest Meetings',
      description: '📍Budapest or #Budapest tagged meetings.',
      avatarFile: 'avatars/budapest3.jpg',
    },
  ],
  shortname,
  commandlineRegex: /(budapest-meetings|bud_meetings)$/i,
}