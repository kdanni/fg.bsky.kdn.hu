
export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;

import { pool } from '../../../algo/connection/connection.mjs';
import crypto from 'crypto';

import {shortname} from '../../../algo/followed.mjs';

async function fetchFeedData(cursorDate) {
  const sql = `call ${'SP_SELECT_followd_feed_posts'}(?,?,?)`;
  const params = [cursorDate, false, 30];
  const rows = await pool.query(sql, params);

  const resultUrls = [];
  let resultCursor = undefined;
  let cDate = cursorDate ? new Date(cursorDate) : new Date();
  if (rows[0] && rows[0][0]) {
    for (const row of rows[0][0] || []) {
      if (row) {
        resultUrls.push({ post: row.url });
        resultCursor = row.url;
        cDate = row.posted_at ? new Date(row.posted_at) : cDate;
      }
    }
  }
  if (resultCursor) {
    const c = await pool.query('SELECT cid, posted_at FROM bsky_post WHERE url = ?', [resultCursor]);
    if (c && c[0] && c[0][0]) {
      resultCursor = `${c[0][0].posted_at}::${c[0][0].cid}`;
    } else {
      const hashedCursor = crypto.createHash('sha256').update(resultCursor).digest('hex');
      resultCursor = `${cDate}::${hashedCursor}`;
    }
  }
  return {
    feed: resultUrls,
    cursor: resultCursor
  };
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