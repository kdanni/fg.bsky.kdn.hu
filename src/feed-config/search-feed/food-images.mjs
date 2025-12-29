export const shortname = 'food-images';

export const TAGS = [
    '#foodsky',
    '#recipe',
    '#recipes',
    '#dish',
    '#cuisine',
    '🍜',
    '#ごはん',
    '#foodporn',
    '#ramen',
    '#ラメン',

]

const tagsRegexArray = TAGS.map(tag => `${tag}\\b`).join('|');
// const tagsRegex = new RegExp(tagsRegexArray, 'i');

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: 'Food Images 🍜',
      description: `Hashtag included: ${TAGS.join(' ')}`,
      avatarFile: 'avatars/food-images.jpg',
    },
  ],
  shortname,
  commandlineRegex: /\b(food-images|FOOD)$/i,
}