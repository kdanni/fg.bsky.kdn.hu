
export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;

import { fetchFeedData } from './util/fetchFeedData-by-FeedName.mjs';

import {shortname} from '../../../algo/kdanni-MusEj.mjs';

async function handleRequest (req, res, next) {
  if(res.locals.cachedData || res.locals.feedData) {
    return next();
  }
  const feed = req.query['feed'];

  if(!feed) {
    return next();
  }
  let regex = new RegExp(`^at://${FEEDGEN_PUBLISHER_DID}/app\.bsky\.feed\.generator/${shortname}$`, 'i');

  if(!regex.test(feed)) {
    return next();
  }
  console.log(`[${shortname}] request`, feed);
  
  let cursorDate = req.locals.cursorDate;
      
  const feedData = await fetchFeedData(shortname, cursorDate);
  res.locals.feedData = feedData;
  res.locals.cacheEX = 3000;
  next();
}

export { shortname };
export default handleRequest;