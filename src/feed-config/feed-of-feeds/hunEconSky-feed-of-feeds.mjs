import { shortname as kg} from '../search-feed/kozgaz.mjs';
import { shortname as sz } from '../search-feed/szamvitel.mjs';
import { shortname as pü } from '../search-feed/penzugyekFeed.mjs';
import { shortname as adó } from '../search-feed/adotanFeed.mjs';

const NOT_PUBLISHED_FEED_NAME = '.econHunSky'; 

export const shortname = 'hunEconSky';
export const shortnameArray = [kg, sz, pü, adó, NOT_PUBLISHED_FEED_NAME];

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#HunEconSky',
      description: 'Merged feed of Közgáz Számvitel and Pénzügyek.',
      avatarFile: 'avatars/KozGaz.png',
    },
  ],
  shortname,
  shortnameArray,
  commandlineRegex: /(hunEconSky)$/i,
}