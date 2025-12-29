export const shortname = 'budapesJobsearch';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#📍Budapest Job',
      description: '📍Budapest or #Budapest tagged job search.',
      avatarFile: 'avatars/budapest3.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\b(budapest-jobs|bud_jobs)$/i,
}