import { shortname as sanpo } from '../search-feed/sanpoHash.mjs';
import { shortname as rodjiura } from '../search-feed/rodjiuraHash.mjs';

const NOT_PUBLISHED_FEED_NAME = '.streetphotographyJapan'; 

export const shortname = 'FstreetphotographyJapan';
export const shortnameArray = [sanpo, rodjiura, NOT_PUBLISHED_FEED_NAME];

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#StreetphotographyJapan',
      description: 'Merged feed of Japanese street photography feeds.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
  shortname,
  shortnameArray,
  commandlineRegex: /(streetphotographyJapan)$/i,
}