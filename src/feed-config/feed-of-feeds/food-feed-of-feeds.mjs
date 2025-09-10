import { shortname as ff } from '../search-feed/food-images.mjs';

const NOT_PUBLISHED_FEED_NAME = '.shadowFoodFeed'; 

export const shortname = 'foodFeedOfF';
export const shortnameArray = [ff, NOT_PUBLISHED_FEED_NAME];

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#FoodFeedOfFeeds',
      description: 'Merged feed of Food posts.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
  shortname,
  shortnameArray,
  commandlineRegex: /(foodFeedOfFeeds|FFoF)$/i,
}