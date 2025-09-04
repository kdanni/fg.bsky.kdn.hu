import { initFeedCache } from '../redis/init-cache.mjs';

import { shortname as ls } from './landscape.mjs';
import { shortname as ts } from './treescape.mjs';
import { shortname as ws } from './waterscape.mjs';

export const shortname = 'treelandwater';
export const shortnameArray = [ls, ts, ws];

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#LandTreeWaterScape',
      description: 'Merged feed of Landscape, Treescape, and Waterscape posts.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
}

export async function runAlgo() {    
  await initFeedCache(shortname, shortnameArray);
  console.log(`[${shortname}] Cache initialized`);
}