export const shortname = 'urban-All';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Urban posts 🌆',
      description: `Urbangaze and urbanlandscape all posts.`,
      avatarFile: 'avatars/urban.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\burban[- ]?all$/i,
}