import { shortname as snB } from './search-feed/brutalism-hashtag.mjs';
import { shortname as snM } from './search-feed/magyarorszag-hashtag.mjs';
import { shortname as snLego } from './search-feed/lego.mjs';
import { shortname as shibari } from './nsfw-feed/nsfw-shibari.mjs';
import { shortname as findom } from './nsfw-feed/nsfw-findom.mjs';
import { shortname as urbex18 } from './nsfw-feed/nsfw-urbex18.mjs';
import { shortname as noturbex18 } from './nsfw-feed/nsfw-notUrban18.mjs';

const sfwFeedMap = {};

sfwFeedMap[snB] = 7;
sfwFeedMap[snM] = 7;
sfwFeedMap[snLego] = 7;
sfwFeedMap[shibari] = 0;
sfwFeedMap[findom] = 0;
sfwFeedMap[urbex18] = 0;
sfwFeedMap[noturbex18] = 0;

export default sfwFeedMap;
