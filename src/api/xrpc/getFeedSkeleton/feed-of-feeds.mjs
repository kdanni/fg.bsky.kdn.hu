export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

import { fetchFeedData } from './util/fetchFeedData.mjs';


import { shortname as snBOoB, shortnameArray as snaBOoB } from '../../../algo/kdanni-Bud-Out-of-Bud.mjs';
import { shortname as snTree, shortnameArray as snaTree } from '../../../algo/treescape-landscape-waterscape.mjs';
import { shortname as snUrban, shortnameArray as snaUrban } from '../../../algo/urban-brutal-tractor.mjs';

const shortnameArrayMap = {};
shortnameArrayMap[snBOoB] = snaBOoB;
shortnameArrayMap[snTree] = snaTree;
shortnameArrayMap[snUrban] = snaUrban;

async function handleRequest (req, res, next) {
  if(res.locals.cachedData || res.locals.feedData) {
    return next();
  }
  const feed = req.query['feed'];

  if(!feed) {
    return next();
  }
  const shortname = `${feed}`.split('/').pop();
  if(!(shortname in shortnameArrayMap)) {
    return next();
  }
  console.log(`[${shortname}] ${JSON.stringify(req.locals)} ${JSON.stringify(res.locals)}`);
  
  let cursorDate = req.locals.cursorDate;

  const feedData = await fetchFeedData(shortnameArrayMap[shortname], cursorDate);
  res.locals.feedData = feedData;
  next();
}

export default handleRequest;