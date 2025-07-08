
export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;

import { pool } from '../../../algo/connection/connection.mjs';
import crypto from 'crypto';

import {shortname} from '../../../algo/not-urban-ex.mjs';

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

  const sql = `call ${'sp_SELECT_feed_posts_by_name'}(?,?,?)`;
  const params = [shortname, cursorDate, 30];
  const rows = await pool.query(sql, params);
  
  const resultUrls = [];
  let resultCursor = undefined;
  if(rows[0] && rows[0][0]) {
    // console.log(`[${shortname}] response`, rows[0][0]);
    for (const row of rows[0][0] || []) {
      if(row) {
        resultUrls.push({post: row.url});
        resultCursor = row.url;
      }
    }
  }
  if(resultCursor) {
    const c = await pool.query('SELECT cid, posted_at FROM bsky_post WHERE url = ?', [resultCursor]);
    // console.log(`[${shortname}] c`, c);
    if (c && c[0] && c[0][0]) {
      resultCursor = `${c[0][0].posted_at}::${c[0][0].cid}`;
    }
  }
  res.locals.feedData = {
    feed: resultUrls,
    cursor: resultCursor
  };
  next();
}

export default handleRequest;