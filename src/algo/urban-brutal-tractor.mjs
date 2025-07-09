import { shortname as nu } from './not-urban-ex.mjs';
import { shortname as tr } from './tractor-hashtag.mjs';
import { shortname as br } from './brutalism-hashtag.mjs';

export const shortname = 'brutalurbantractor';
export const shortnameArray = [nu, tr, br];

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#BrutalUrbanTractor',
      description: 'Merged feed of Brutalism, Not Urbanex, and Tractor posts.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
}

export async function runAlgo() {    
    // NOP
}