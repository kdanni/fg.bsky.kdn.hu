import { shortname as város} from '../search-feed/hun-city-all.mjs';
import { shortname as bud } from '../search-feed/budapest-all.mjs';
import { shortname as hs } from '../search-feed/hunsky.mjs';
import { shortname as mo } from '../search-feed/magyarorszag-hashtag.mjs';

const NOT_PUBLISHED_FEED_NAME = '.HunFeedOfFeeds'; 

export const shortname = 'hun-feed-of-feeds';
export const shortnameArray = [város, bud, hs, mo, NOT_PUBLISHED_FEED_NAME];

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#HunFeedOfFeeds',
      description: 'Merged feed of Hungarian city and hashtag posts.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
  shortname,
  shortnameArray,
  commandlineRegex: /(hun-feed-of-feeds)$/i,
}