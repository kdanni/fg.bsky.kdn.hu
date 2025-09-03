
export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

import { fetchFeedDataBySql } from './util/fetchFeedData.mjs';

import { shortname as snF } from '../../../algo/followed.mjs';
import { shortname as snL } from '../../../algo/listed.mjs';
import { shortname as snFL } from '../../../algo/followed_or_listed.mjs';
import { shortname as fav } from '../../../algo/favorites.mjs';
import { shortname as nsfw} from '../../../algo/nsfw.mjs';
import { shortname as nsfw_feed} from '../../../feed-config/nsfw-scored.mjs';
import { shortname as myFL} from '../../../feed-config/my-follower-list.mjs';
import { shortname as art} from '../../../feed-config/artwork.mjs';
import { shortname as petFL} from '../../../feed-config/followed_or_listed_PET.mjs';


const shortnameSPs = {};
shortnameSPs[fav] = 'sp_SELECT_favorites_posts_by_cursor';
shortnameSPs[snL] = 'SP_SELECT_listed_feed_posts';
shortnameSPs[snFL] = 'SP_SELECT_followed_or_listed_feed_posts';
shortnameSPs[snF] = 'SP_SELECT_followd_feed_posts';
shortnameSPs[nsfw] = 'SP_SELECT_nsfw_listed_posts';
shortnameSPs[nsfw_feed] = 'sp_SELECT_nsfw_feed_posts_by_cursor';
shortnameSPs[myFL] = 'SP_SELECT_listed_feed_posts_my_followers';
shortnameSPs[petFL] = 'SP_SELECT_followed_or_listed_feed_posts_PET';
shortnameSPs[art] = 'sp_SELECT_artwork_feed_posts_by_cursor';

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