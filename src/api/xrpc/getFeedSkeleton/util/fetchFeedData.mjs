import { pool } from '../../../../algo/connection/connection.mjs';
import crypto from 'crypto';

export async function fetchFeedData(shortname, cursorDate, limit = 30) {
  let sql = `call ${'sp_SELECT_feed_posts_by_name'}(?,?,?)`;
  if (Array.isArray(shortname)) {
    sql = `call ${'sp_SELECT_feed_posts_by_nameInArray'}(?,?,?)`;
    shortname = JSON.stringify(shortname);
  }
  const params = [shortname, cursorDate, limit];
  
  return await fetchFeedDataBySql(sql, params, cursorDate);
}

export async function fetchFeedDataBySql(sql, params, cursorDate) {
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