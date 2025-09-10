import { aiListedDictionary, artistListedDictionary, nsfwListedDictionary, musicListedDictionary } from './post-post-tagging.mjs';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

// # Quick reference table
// Condition	API labels entry includes	Client effect (depending on user settings)
// Explicit sexual content	"val": "porn"	Warned or hidden based on moderation settings
// Suggestive or mild nudity	"val": "sexual" or "val": "nudity"	Warned or visible depending on label and settings
// Violent/gory imagery	"val": "graphic-media"	Treated like other adult-only content
// System-wide hiding label	"val": "!hide" or "val": "!warn"	Generic warning or removal, non-overridable

const NSFW_LABELS = [
  'porn',
  'sexual',
  'graphic-media',
  '!hide'
];

const MILD_LABELS = [
  'nudity',
  'sexual',
  '!warn'
];

const NSFW_HASHTAGS = [
  '#nsfw',
  '#nsfwbluesky',
  '#xxx',
  '#porn\\b',
  '#graphicmedia',
  '#dick\\b',
  '#fatcockfriday',
  '#zoofilia', 
  '#whore', 
  '#anal\\b', 
  '#torture',
  '#blackcock',
  '#cumtribute', 
  '#cocktribute', 
  '#facefuck', 
  '#slutdiaries',
  '#exhib\\b',
  '#hardon',
  '#bigcock',
];

const NSFW_HASHTAGS_REGEX = new RegExp(
  `(${NSFW_HASHTAGS.join('|')})`,
  'i'
);

const MILD_HASHTAGS = [
  '#nudity',
  '#nudist',
  '#nudism',
  '#naturist',
  '#naturism',
  '#nude\\b',
  '#nudeart',
  '#nudeartphotography',
  '#eroticphotography',
  '#eroticnude',
  '#pornart',
  '#sexual\\b',
  '#sex\\b',
  '#onlyfans',
  'onlyfans.com',
  '#kink\\b',
];

const MILD_HASHTAGS_REGEX = new RegExp(
  `(${MILD_HASHTAGS.join('|')})`,
  'i'
);

export function getSafeForWorkScore(item, mildScore = 5) {
  let safeForWorkScore = 10;
  const did = item?.post?.author?.did;
  if(did) {
    if(nsfwListedDictionary[did]) {
      return 0;
    }
  }
  if (!item?.post?.uri) {
    if(item.url && (item.text || item.labels)) {
      // console.dir(item, {depth: null});
      item.post = {
        uri: item.url,
        record : {
          text: item.text,
          labels: item.labels
        }
      };
    }
    else {
      return -1;
    }
  }

  if (!item?.post?.record?.labels && item?.post?.labels) {
    item.post.record.labels = item.post.labels;
  }

  if (item?.post?.record?.labels?.length > 0) {
    DEBUG && console.log(`[SFW score] Post ${item.post.record.text} has labels: ${JSON.stringify(item.post.record.labels)}`);
    for (const label of item.post.record.labels) {
      DEBUG && console.log(`[SFW score] Post ${item.post.record.text} has NSFW label: ${label.val}`);
      if (NSFW_LABELS.includes(label.val)) {
        safeForWorkScore = 0;
        break;
      }
      if (MILD_LABELS.includes(label.val)) {
        safeForWorkScore = Math.min(safeForWorkScore, mildScore);
      }
    }
  }  
  if (safeForWorkScore !== 0 && item?.post?.record?.labels?.values?.length > 0) {
    DEBUG && console.log(`[SFW score] Post ${item.post.record.text} has SELF labels: ${JSON.stringify(item.post.record.labels)}`);
    for (const label of item.post.record.labels.values) {
      if (NSFW_LABELS.includes(label.val)) {
        safeForWorkScore= 0;
        break;
      }      
      if (MILD_LABELS.includes(label.val)) {
        safeForWorkScore = Math.min(safeForWorkScore, mildScore);
      }
    }
  }
  if (safeForWorkScore !== 0 && item?.post?.record?.text) {
    if (NSFW_HASHTAGS_REGEX.test(item.post.record.text)) {
      safeForWorkScore = 0;
      DEBUG && console.log(`[SFW score] Post ${item.post.record.text} has labels: ${JSON.stringify(item.post.record.labels)}`);    
    } else if (MILD_HASHTAGS_REGEX.test(item.post.record.text)) {
      safeForWorkScore = Math.min(safeForWorkScore, mildScore);
      DEBUG && console.log(`[SFW score] Post ${item.post.record.text} has labels: ${JSON.stringify(item.post.record.labels)}`);    
    }
  }

  DEV_ENV && console.log(`[SFW score] Score: ${safeForWorkScore}, Post ${item.post.record.text} has labels: ${JSON.stringify(item.post.record.labels)}`);

  return safeForWorkScore;
}

export function listSfwScore(listName, safeForWorkScore = 10) {
  if (/NSFW/i.test(`${listName}`)) {
    safeForWorkScore = 0;
  } else
  if (/!nsfw/i.test(`${listName}`)) {
    safeForWorkScore = 0;
  } else
  if (/Not Listed/i.test(`${listName}`)) {
    safeForWorkScore = 5;
  } else
  if (/^Pol$/i.test(`${listName}`)) {
    safeForWorkScore = 5;
  }
  return safeForWorkScore;
}

export function getMimeStringOrNull(embed) {
  if (!embed) return null;
  if (embed.$type === 'app.bsky.embed.images') {
    return embed.images?.some(
      (img) => img.image?.mimeType?.startsWith('image/')
    ) ? 'image/' : '?';
  }
  if (embed.$type === 'app.bsky.embed.recordWithMedia') {
    return getMimeStringOrNull(embed.media);
  }
  return 'embed?';
}

const ARTWORK_TAGS = [
  '#artwork',
  '#[^ ]+artwork',
  '#oilpainting',
  '#watercolor',
  '#watercolour',
  '#acrylic',
  'acrylic marker',
  'acrylic pen',
  '#sketch',
  '#[^ ]+sketch',
  '\\bacrylic on\\b',
  '\\bon canvas\\b',
  '#digitalart',
  '#traditionalart',
  '#painting',
  '#[^ ]+painting',
  '#drawing',
  '#[^ ]+drawing',
  '#illustration',
  '#3dmodeling',
  '#fineart',
  '#mindcraft',
  '#pixelart',
  '#artshare',
  '#artsell',
  '#artsale',
  '#buyart',
  '#collectart',
  '#3d\\b',
  '#blender',
  '#quilt',
  '#[^ ]+quilt',
  '#commissionart',
  '#cartoon',
  '#conceptart',
  '#saturated',
  '#abstractart',
  '#3dprint',
  '#miniature',
  '#sculpture',
  '#sculpting',
  '#terrain',
  '#diorama',
  '#[^ ]+miniature',
  '#[^ ]+sculpture',
  '#[^ ]+sculpting',
  '#[^ ]+terrain',
  '#[^ ]+diorama',
  '#icmphotography',
  '#infrared',
];

const ARTWORK_TAGS_REGEX = new RegExp(
  `(${ARTWORK_TAGS.join('|')})`,
  'i'
);

const AI_ARTWORK_TAGS = [
  '#aiart',
  '#ai\\b',
  '#generativeart',
  '#genart\\b',
  '#genai\\b',
  '#synthart\\b',
  '#midjourney\\b',
  '#dall-?e\\d?\\b',
];

const AI_ARTWORK_TAGS_REGEX = new RegExp(
  `(${AI_ARTWORK_TAGS.join('|')})`,
  'i'
);


const FANTASY_ARTWORK_TAGS = [
  '#fantasy',
  '#furry',
  '#dragon',
  '#[^ ]+fantasy',
  '#ocart',
  '#characterart',
  '#virtualphotography',
  '#pokemon',
  '#vtube',
];

const FANTASY_ARTWORK_TAGS_REGEX = new RegExp(
  `(${FANTASY_ARTWORK_TAGS.join('|')})`,
  'i'
);

const MUSIC_TAGS = [
  '#music',
  '#[^ ]+music',
  '#musician',
  '#singer',
  '#songwriter',
  '#band',
  '#album',
  '#concert',
  '#liveperformance',
  '#audiophile',
  '#musiclover',
  '#jazz',
  '#rocknroll',
  '#hiphop',
  '#ebm\\b',
  '#postpunk',
  '#DJ',
];

const MUSIC_TAGS_REGEX = new RegExp(
  `(${MUSIC_TAGS.join('|')})`,
  'i'
);

const STREAMING_HASHTAGS = [
  '#twitch',
  '#youtube',
  '#mixer',
  '#trovo',
  '#kick',
  '#streamer',
  '#livestream',
  '#gamingstream',
  '#justchatting',
  '#IRLstream',
  '#vtuber',
];

const STREAMING_HASHTAGS_REGEX = new RegExp(`(${STREAMING_HASHTAGS.join('|')})`, 'i');

const PET_HASHTAG = [
  '#cat\\b',
  '#cats\\b',
  '#dog\\b',
  '#dogs\\b',
  '#caturday',
  '#catsofbluesky\\b',
  '#catsky\\b',
  '#dogsofbluesky\\b',
  '#dogsky\\b',
  '#petsofbluesky\\b',
  '#petsky\\b',
  '#puppy\\b',
  '#kitten\\b',
  '#catlove\\b',
  '#catlife\\b',
  '#dogfriends\\b',
  '#doglovers\\b',
  '#petstagram\\b',
  '#petphotography\\b'
]

const PET_HASHTAGS_REGEX = new RegExp(`(${PET_HASHTAG.join('|')})`, 'i');

const POL_HASHTAG = [
  '#maga',
  '#trump',
  '#republican',
  '#conservative',
  '#democrat',
  '#liberal',
  '#leftist',
  '#progressive',
  '#orbán',
  '#OrbánViktor',
  '#fidesz',
  '#Hatvanpuszta',
  '#MészárosLőrinc',
  '#hadházyákos',
]

const POL_HASHTAGS_REGEX = new RegExp(`(${POL_HASHTAG.join('|')})`, 'i');

export function isArtwork(item, mime) {
  if (!item?.post?.record?.text) {
    if(item?.record?.text) {
      item = {post:item};
    } else {
      return false;
    }
  }
  let isArtwork = ARTWORK_TAGS_REGEX.test(item.post.record.text);
  let isAiArtwork = AI_ARTWORK_TAGS_REGEX.test(item.post.record.text);
  let isFantasyArtwork = FANTASY_ARTWORK_TAGS_REGEX.test(item.post.record.text);
  let isPetPost = PET_HASHTAGS_REGEX.test(item.post.record.text);
  let isPolPost = POL_HASHTAGS_REGEX.test(item.post.record.text);
  let isMusicPost = MUSIC_TAGS_REGEX.test(item.post.record.text);
  let isStreamingPost = STREAMING_HASHTAGS_REGEX.test(item.post.record.text);
  let retString = '';
  const did = item?.post?.author?.did;
  if(did) {
    if(artistListedDictionary[did]) {
      isArtwork = true;
    }
    if(aiListedDictionary[did]) {
      isAiArtwork = true;
    }
    if(musicListedDictionary[did]) {
      isMusicPost = true;
    }
  }
  if(mime) {
    retString = `${mime}`;
  }
  if (isArtwork) {
    retString += '::ARTWORK';
  }
  if (isAiArtwork) {
    retString += '::AIART';
  }
  if (isFantasyArtwork) {
    retString += '::FANTASY';
  }
  if (isPetPost) {
    retString += '::PET';
  }
  if (isPolPost) {
    retString += '::POL';
  }
  if (isMusicPost) {
    retString += '::MUSIC';
  }
  if (isStreamingPost) {
    retString += '::STREAM';
  }
  return retString.trim();
}

export function getLanguageOrEn(record) {
  if (!record || !record.langs) {
    return 'en';
  }
  const langs = record.langs;
  if (langs && langs.length > 0) {
    // Return the first not english or hungarian language
    for (const lang of langs) {
      if (lang !== 'en' && lang !== 'hu') {
        return lang;
      }
    }
    // If all are english or hungarian, return the first one
    return langs[0];
  }
  return 'en'; // Default to English if no languages are specified
}