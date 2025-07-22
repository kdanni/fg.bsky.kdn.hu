import { shortname as bud } from './kdanni-Bud.mjs';
import { shortname as oobud } from './kdanni-out-of-Bud.mjs';

export const shortname = 'kd-Bud-OutofBud';
export const shortnameArray = [bud, oobud];

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Budapest&#OutOfTheCity',
      description: 'Merged feed of my Budapest and my OutOfTheCity posts.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
}

export async function runAlgo() {    
    // NOP
}