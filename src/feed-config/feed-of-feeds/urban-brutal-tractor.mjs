import { shortname as nu } from '../search-feed/not-urban-ex.mjs';
import { shortname as tr } from '../search-feed/tractor-hashtag.mjs';
import { shortname as br } from '../search-feed/brutalism-hashtag.mjs';
import { shortname as sm } from '../search-feed/socialist-modernism.mjs';
import { shortname as rw } from '../search-feed/railway.mjs';
import { shortname as ub } from '../search-feed/urbex.mjs';
import { shortname as gr } from '../search-feed/graffiti.mjs';

const NOT_PUBLISHED_FEED_NAME = '.shadowUrban'; 

export const shortname = 'brutalurbantractor';
export const shortnameArray = [nu, tr, br, sm, rw, ub, gr, NOT_PUBLISHED_FEED_NAME];

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#BrutalUrbanTractor',
      description: 'Merged feed of Brutalism, Not Urbanex, Railway, and Tractor posts.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
  shortname,
  shortnameArray,
  commandlineRegex: /(urban-brutal-tractor|UBT)$/i,
}