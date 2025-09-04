import { shortname as snF } from './sp-feed/followed.mjs';
import { shortname as snL } from './sp-feed/listed.mjs';
import { shortname as snFL } from './sp-feed/followed_or_listed.mjs';
import { shortname as fav } from './sp-feed/favorites.mjs';
import { shortname as nsfw} from './sp-feed/nsfw.mjs';
import { shortname as nsfw_feed} from './sp-feed/nsfw-scored.mjs';
import { shortname as myFL} from './sp-feed/my-follower-list.mjs';
import { shortname as art} from './sp-feed/artwork.mjs';
import { shortname as petFL} from './sp-feed/followed_or_listed_PET.mjs';

const spFeedMap = {};

spFeedMap[fav] = 'sp_SELECT_favorites_posts_by_cursor';
spFeedMap[snL] = 'SP_SELECT_listed_feed_posts';
spFeedMap[snFL] = 'SP_SELECT_followed_or_listed_feed_posts';
spFeedMap[snF] = 'SP_SELECT_followd_feed_posts';
spFeedMap[nsfw] = 'SP_SELECT_nsfw_listed_posts';
spFeedMap[nsfw_feed] = 'sp_SELECT_nsfw_feed_posts_by_cursor';
spFeedMap[myFL] = 'SP_SELECT_listed_feed_posts_my_followers';
spFeedMap[petFL] = 'SP_SELECT_followed_or_listed_feed_posts_PET';
spFeedMap[art] = 'sp_SELECT_artwork_feed_posts_by_cursor';

export default spFeedMap;