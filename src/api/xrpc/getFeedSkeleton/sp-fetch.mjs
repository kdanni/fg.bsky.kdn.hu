import { fetchFeedDataBySql } from './util/fetchFeedData.mjs';

import shortnameSPs from '../../../feed-config/sp-feed-map.mjs';

async function fetchFeedData(shortname, cursorDate) {
  const sql = `call ${shortnameSPs[shortname]}(?,?,?,?)`;
  const params = [cursorDate, 30, -10, null];
  return await fetchFeedDataBySql(sql, params, cursorDate);
}

async function handleRequest(req, res, next) {
  if (res.locals.cachedData || res.locals.feedData) {
    return next();
  }
  const feed = req.query['feed'];

  if (!feed) {
    return next();
  }
  const shortname = `${feed}`.split('/').pop();
  if(!(shortname in shortnameSPs)) {
    return next();
  }
  console.log(`[${shortname}] ${JSON.stringify(req.locals)} ${JSON.stringify(res.locals)}`);

  let cursorDate = req.locals.cursorDate;

  const feedData = await fetchFeedData(shortname, cursorDate);
  res.locals.feedData = feedData;
  next();
}

export async function getInitialFeedData(shortname) {
  try {
    const datePlus1Hour = new Date();
    datePlus1Hour.setHours(datePlus1Hour.getHours() + 1);
    return await fetchFeedData(shortname, datePlus1Hour);
  } catch (error) {
    console.error(`[${shortname}] Error in getInitialFeedData:`, error);
    return null;
  }
}

export { shortnameSPs };
export default handleRequest;