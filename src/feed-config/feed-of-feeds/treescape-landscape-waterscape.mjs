import { shortname as ls } from '../search-feed/landscape.mjs';
import { shortname as ts } from '../search-feed/treescape.mjs';
import { shortname as ws } from '../search-feed/waterscape.mjs';
import { shortname as ss } from '../search-feed/sunset-sunrise.mjs';
import { shortname as sn } from '../search-feed/snowscape.mjs';

export const shortname = 'treelandwater';
export const shortnameArray = [ls, ts, ws, ss, sn];

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
  shortname,
  shortnameArray,
  commandlineRegex: /(treelandwater)$/i,
}