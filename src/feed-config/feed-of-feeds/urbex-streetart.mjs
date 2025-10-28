import { shortname as ub } from '../search-feed/urbex.mjs';
import { shortname as gr } from '../search-feed/graffiti.mjs';

import { shortname as sanpo } from '../search-feed/sanpoHash.mjs';
import { shortname as rodjiura } from '../search-feed/rodjiuraHash.mjs';

const JAP = '.streetphotographyJapan'; 


const NOT_PUBLISHED_FEED_NAME = '.urbexFeedOfFeeds'; 

export const shortname = 'urbex-streetart';
export const shortnameArray = [ub, gr, sanpo, rodjiura, JAP, NOT_PUBLISHED_FEED_NAME];

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#UrbexFeedOfFeeds',
      description: 'Merged feed of Urbex and Streetart posts.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
  shortname,
  shortnameArray,
  commandlineRegex: /(urbex-streetart)$/i,
}