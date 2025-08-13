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
  '#porn',
  '#graphicmedia',
  '#dick',
  '#fatcockfriday',
  '#zoofilia', 
  '#whore', 
  '#anal', 
  '#torture',
  '#blackcock',
  '#cumtribute', 
  '#cocktribute', 
  '#facefuck', 
  '#slutdiaries',
  '#exhib',
  '#hardon',
  '#bigcock',
];

const NSFW_HASHTAGS_REGEX = new RegExp(
  `(${NSFW_HASHTAGS.map(tag => tag.replace('#', '')).join('|')})`,
  'i'
);

const MILD_HASHTAGS = [
  '#nudity',
  '#nudist',
  '#nude',
  '#nudeart',
  '#nudeartphotography',
  '#eroticphotography',
  '#eroticnude',
  '#pornart',
  '#sexual',
  '#sex',
  '#onlyfans',
  'onlyfans.com',
  '#kink',
];

const MILD_HASHTAGS_REGEX = new RegExp(
  `(${MILD_HASHTAGS.map(tag => tag.replace('#', '')).join('|')})`,
  'i'
);

export function getSafeForWorkScore(item, mildScore = 5) {
  let safeForWorkScore = 10;
  if (!item?.post?.uri) {
    return -1;
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