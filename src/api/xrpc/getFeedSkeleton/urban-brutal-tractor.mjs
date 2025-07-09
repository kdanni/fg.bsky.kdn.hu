
export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;

import { fetchFeedData } from './util/fetchFeedData-by-FeedName.mjs';

import { shortname as nu } from '../../../algo/not-urban-ex.mjs';
import { shortname as tr } from '../../../algo/tractor-hashtag.mjs';
import { shortname as br } from '../../../algo/brutalism-hashtag.mjs';

const shortname = 'brutalurbantractor';
const shortnameArray = [nu, tr, br];

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

async function handleRequest(req, res, next) {
  if (res.locals.cachedData || res.locals.feedData) {
    return next();
  }
  const feed = req.query['feed'];

  if (!feed) {
    return next();
  }
  let regex = new RegExp(`^at://${FEEDGEN_PUBLISHER_DID}/app\.bsky\.feed\.generator/${shortname}$`, 'i');

  if (!regex.test(feed)) {
    return next();
  }
  console.log(`[${shortname}] ${JSON.stringify(req.locals)} ${JSON.stringify(res.locals)}`);

  let cursorDate = req.locals.cursorDate;

  const feedData = await fetchFeedData(shortnameArray, cursorDate);
  res.locals.feedData = feedData;
  next();
}

export { shortname, shortnameArray };
export default handleRequest;