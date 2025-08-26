export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

import { fetchFeedData } from './util/fetchFeedData.mjs';

async function handleRequest (req, res, next) {
  if(res.locals.cachedData || res.locals.feedData) {
    return next();
  }
  const feed = req.query['feed'];

  if(!feed) {
    return next();
  }
  const shortname = `${feed}`.split('/').pop();
  console.log(`[${shortname}] ${JSON.stringify(req.locals)} ${JSON.stringify(res.locals)}`);
  
  let cursorDate = req.locals.cursorDate;

  const feedData = await fetchFeedData(shortname, cursorDate);
  res.locals.feedData = feedData;
  next();
}

export default handleRequest;