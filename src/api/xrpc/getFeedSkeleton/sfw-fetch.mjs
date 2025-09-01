
export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;

import { fetchFeedData } from './util/fetchFeedData.mjs';

import {shortname as bpH} from '../../../algo/budapest-hashtag.mjs';
import {shortname as moH} from '../../../algo/magyarorszag-hashtag.mjs';

const shortNamesSFW = {}
shortNamesSFW[bpH] = 7;
shortNamesSFW[moH] = 7;
shortNamesSFW['lego'] = 7;

async function handleRequest (req, res, next) {
  if(res.locals.cachedData || res.locals.feedData) {
    return next();
  }
  const feed = req.query['feed'];
  if(!feed) {
    return next();    
  }
  const shortname = `${feed}`.split('/').pop();
  if(!(shortname in shortNamesSFW)) {
    return next();
  }
  console.log(`[${shortname}] ${JSON.stringify(req.locals)} ${JSON.stringify(res.locals)}`);
  
  let cursorDate = req.locals.cursorDate;

  const feedData = await fetchFeedData(shortname, cursorDate, 30, shortNamesSFW[shortname]);
  res.locals.feedData = feedData;
  next();
}

export { shortNamesSFW };
export default handleRequest;