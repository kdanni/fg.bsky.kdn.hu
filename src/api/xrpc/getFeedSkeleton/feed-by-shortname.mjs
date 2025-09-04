export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

import { fetchFeedData } from './util/fetchFeedData.mjs';

import shortnameArrayMap from '../../../feed-config/feed-of-feeds-map.mjs';
import shortNamesSFW from '../../../feed-config/sfw-feed-map.mjs';


async function handleRequest (req, res, next) {
  if(res.locals.cachedData || res.locals.feedData) {
    return next();
  }
  const feed = req.query['feed'];

  if(!feed) {
    return next();
  }
  let fetchFeedDataParam = null;
  const shortname = `${feed}`.split('/').pop();
  console.log(`[${shortname}] ${JSON.stringify(req.locals)} ${JSON.stringify(res.locals)}`);
  
  if(shortname in shortnameArrayMap) { 
    fetchFeedDataParam = shortnameArrayMap[shortname];
  } else {
    fetchFeedDataParam = shortname;
  }
  let sfwParam = null;
  if(shortname in shortNamesSFW) {
    sfwParam = shortNamesSFW[shortname];
  }

  let cursorDate = req.locals.cursorDate;

  const feedData = await fetchFeedData(fetchFeedDataParam, cursorDate, 30, sfwParam);
  res.locals.feedData = feedData;
  next();
}

export default handleRequest;