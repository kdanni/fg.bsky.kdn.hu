
export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;

import { pool } from '../../../algo/connection/connection.mjs';

import {shortname} from '../../../algo/kdanni-MusEj.mjs';

async function handleRequest (req, res, next) {

  const feed = req.query['feed'];

  if(!feed) {
    return next();
  }
  let regex = new RegExp(`^at://${FEEDGEN_PUBLISHER_DID}/app\.bsky\.feed\.generator/${shortname}$`, 'i');

  if(!regex.test(feed)) {
    return next();
  }
  console.log(`[${shortname}] request`, feed);
  
  let date0 = new Date();
  date0.setDate(date0.getDate() + 1);
  const cursor = req.query['cursor'];
  let cursorDate = date0;
  if(cursor) {
    // console.log(`[${shortname}] cursor`, cursor);
    const [timestamp, cid] = cursor.split('::');
    // console.log(`[${shortname}] timestamp`, timestamp);
    if (timestamp) {
        cursorDate = new Date(timestamp);
    }
  }

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
  res.json({
    feed: resultUrls,
    cursor: resultCursor
  })
}

export default handleRequest;