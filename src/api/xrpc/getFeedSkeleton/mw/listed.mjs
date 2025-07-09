
export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;

import { fetchFeedDataBySql } from '../util/fetchFeedData.mjs';

import {shortname} from '../../../../algo/listed.mjs';

async function fetchFeedData(cursorDate) {
  const sql = `call ${'SP_SELECT_listed_feed_posts'}(?,?,?)`;
  const params = [cursorDate, false, 30];
  return await fetchFeedDataBySql(sql, params, cursorDate);
}

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
  console.log(`[${shortname}] ${JSON.stringify(req.locals)} ${JSON.stringify(res.locals)}`);
  
  let cursorDate = req.locals.cursorDate;

  const feedData = await fetchFeedData(cursorDate);
  res.locals.feedData = feedData;
  next();
}

export async function getInitialFeedData() {
  try {
    const datePlus1Hour = new Date();
    datePlus1Hour.setHours(datePlus1Hour.getHours() + 1);
    return await fetchFeedData(datePlus1Hour);
  } catch (error) {
    console.error(`[${shortname}] Error in getInitialFeedData:`, error);
    return null;
  }
}

export { shortname };
export default handleRequest;