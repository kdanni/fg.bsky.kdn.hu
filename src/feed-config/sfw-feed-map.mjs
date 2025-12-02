import { shortname as snB } from './search-feed/brutalism-hashtag.mjs';
import { shortname as snM } from './search-feed/magyarorszag-hashtag.mjs';
import { shortname as snLego } from './search-feed/lego.mjs';
import { shortname as shibari } from './nsfw-feed/nsfw-shibari.mjs';
import { shortname as findom } from './nsfw-feed/nsfw-findom.mjs';

const sfwFeedMap = {};

sfwFeedMap[snB] = 7;
sfwFeedMap[snM] = 7;
sfwFeedMap[snLego] = 7;
sfwFeedMap[shibari] = 0;
sfwFeedMap[findom] = 0;

export default sfwFeedMap;