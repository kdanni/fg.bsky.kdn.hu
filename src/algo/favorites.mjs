
export const shortname = 'kdanni-Favorites';

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '@kdanni.hu - Liked',
      description: 'Posts that I have liked. No replies. On profile liked posts are liked order. Here it was merged together.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
}

// const TARGET_AUTHOR_DID = process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID;
// const DEV_ENV = process.env.ENV === 'DEV';
    

export async function runAlgo(authorDid) {    
    // NOP
}