import { shortname as bud } from '../author-feed/kdanni-Bud.mjs';
import { shortname as oobud } from '../author-feed/kdanni-out-of-Bud.mjs';

export const shortname = 'kd-Bud-OutofBud';
export const shortnameArray = [bud, oobud];

export const FEEDGEN_CONFIG = {
  publisherDid: `${process.env.FEEDGEN_PUBLISHER_DID}`,
  feeds: [
    {
      uri: `at://${process.env.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${shortname}`,
      id: `${shortname}`,
      displayName: '#Budapest&#OutOfTheCity',
      description: 'Merged feed of my Budapest and my OutOfTheCity posts.',
      avatarFile: 'avatars/kdn.jpg',
    },
  ],
  shortname,
  shortnameArray,
  commandlineRegex: /(kdanni-Bud-Out-of-Bud|kd_Bud_OoB)$/i,
  TARGET_AUTHOR_DID: `${process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID}`,
}