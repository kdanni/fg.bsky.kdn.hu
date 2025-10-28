const NOT_PUBLISHED_FEED_NAME = '.shadowNoTime'; 
const urbanS = '.shadowUrban'; 
const urbrexS = '.urbexFeedOfFeeds'; 
const bpImage = '.budapestImg'; 
const foodNoTime = '.foodNoTime'; 



import { shortname as nu } from '../search-feed/not-urban-ex.mjs';
import { shortname as tr } from '../search-feed/tractor-hashtag.mjs';
import { shortname as br } from '../search-feed/brutalism-hashtag.mjs';
import { shortname as sm } from '../search-feed/socialist-modernism.mjs';
import { shortname as rw } from '../search-feed/railway.mjs';
import { shortname as ss } from '../search-feed/sunset-sunrise.mjs';
import { shortname as sn } from '../search-feed/snowscape.mjs';
// import { shortname as ff } from '../search-feed/food-images.mjs';
import { shortname as ts } from '../search-feed/treescape.mjs';
import { shortname as f } from '../search-feed/fungi-images.mjs';
import { shortname as ws } from '../search-feed/waterscape.mjs';
import { shortname as város} from '../search-feed/hun-city-all.mjs';



export const shortname = 'IhaveNoTimeForBsky';
export const shortnameArray = [nu, tr, br, sm, rw, ss, sn, f, város, ts, ws,
  NOT_PUBLISHED_FEED_NAME, urbanS, urbrexS, bpImage, foodNoTime];

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#IhaveNoTimeForBsky',
      description: 'I have no time for Bluesky.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
  shortname,
  shortnameArray,
  commandlineRegex: /(ihavenotime)$/i,
}