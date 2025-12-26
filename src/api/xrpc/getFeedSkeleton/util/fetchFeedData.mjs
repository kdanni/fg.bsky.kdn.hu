import { pool } from './connection.mjs';
import crypto from 'crypto';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

export async function fetchFeedData(shortname, cursorDate, limit = 30, sfw = 2, sfwTopParam = 99) {
  let sql = `call ${'sp_SELECT_feed_posts_by_name'}(?,?,?,?,?)`;
  if (Array.isArray(shortname)) {
    sql = `call ${'sp_SELECT_feed_posts_by_nameInArray'}(?,?,?,?,?)`;
    shortname = JSON.stringify(shortname);
  }
  const params = [shortname, cursorDate, limit, sfw, sfwTopParam];
  
  return await fetchFeedDataBySql(sql, params, cursorDate);
}

export async function fetchFeedDataBySql(sql, params, cursorDate) {
  const rows = await pool.query(sql, params);
  DEBUG && console.log(`[fetchFeedDataBySql] [SQL] ${sql} | ${JSON.stringify(params)}`);
  DEBUG && console.dir(rows[0] , {depth: 2});
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
  DEBUG && console.log(`[fetchFeedDataBySql] cDate: ${cDate}`);
  if (resultCursor) {
    const c = await pool.query('SELECT cid, posted_at FROM bsky_post WHERE url = ?', [resultCursor]);
    DEBUG && console.dir(c[0], {depth: 2});
    if (c && c[0] && c[0][0]) {
      resultCursor = `${new Date(c[0][0].posted_at).toISOString()}::${c[0][0].cid}`;
    } else {
      const hashedCursor = crypto.createHash('sha256').update(resultCursor).digest('hex');
      resultCursor = `${cDate.toISOString()}::${hashedCursor}`;
    }
  }
  return {
    feed: resultUrls,
    cursor: resultCursor
  };
}

export async function getInitialFeedData(shortname, sfw = 2) {
  try {
    const datePlus1Hour = new Date();
    datePlus1Hour.setHours(datePlus1Hour.getHours() + 1);
    return await fetchFeedData(shortname, datePlus1Hour, 30, sfw);
  } catch (error) {
    console.error(`[${shortname}] Error in getInitialFeedData:`, error);
    return null;
  }
}