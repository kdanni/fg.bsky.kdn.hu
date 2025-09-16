import { shortname as snB } from './search-feed/brutalism-hashtag.mjs';
import { shortname as snM } from './search-feed/magyarorszag-hashtag.mjs';
import { shortname as snLego } from './search-feed/lego.mjs';
import { shortname as shibari } from './nsfw-feed/nsfw-shibari.mjs';

const sfwFeedMap = {};

sfwFeedMap[snB] = 7;
sfwFeedMap[snM] = 7;
sfwFeedMap[snLego] = 7;
sfwFeedMap[shibari] = 0;

export default sfwFeedMap;