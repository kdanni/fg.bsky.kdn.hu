export const shortname = 'nsfw-Listed';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'NSFW listed 🔞',
      description: 'I assume you working in a conservative environment.',
      avatarFile: 'avatars/nsfw.png',
    },
  ],
}

export async function runAlgo() {    
    // NOP
}