import { getMimeStringOrNull, getLanguageOrEn, getSafeForWorkScore, isArtwork } from './util.mjs';
import { pool } from './connection/connection.mjs';

import qe from '../quote-process/quoted-event-emitter.mjs';

export async function upsertPostProcess(item, p_sfw = 10) {
    let has_image = getMimeStringOrNull(item?.post?.record?.embed);
    has_image = isArtwork(item, has_image);
    let langs = getLanguageOrEn(item?.post?.record);

    let replyParent = item?.post?.record?.reply?.parent?.uri || null;
    let replyRoot = item?.post?.record?.reply?.root?.uri || null;

    let safeForWorkScore = getSafeForWorkScore(item);
    safeForWorkScore = Math.min(safeForWorkScore, p_sfw);
    
    // bluesky post indexed / posted at time in UTC
    // item?.post?.indexedAt||null
    let posted_at_UTC = new Date(item?.post?.indexedAt||(new Date()).toLocaleTimeString('en-US', {timeZone: 'UTC'}));
    // convert to CET
    // Convert UTC to Europe/Budapest time (handles DST)
    let posted_at_CET = new Date(posted_at_UTC.toLocaleString('en-US', { timeZone: 'Europe/Budapest' }));

    const params = [
        item?.post?.uri||null,
        item?.post?.cid||null,
        item?.post?.author?.did||null,
        replyParent || replyRoot || null,
        item?.post?.record?.text||'',
        langs || 'en',
        JSON.stringify(item?.post?.record?.facets||null),
        JSON.stringify(item?.post?.record?.embed||null),
        JSON.stringify(item?.post?.record?.labels||null),
        has_image||null,
        safeForWorkScore,
        posted_at_CET,
    ];
    
    return { params , safeForWorkScore, has_image, embed: item?.post?.record?.embed};
}

export async function upsertPost(item, p_sfw = 10) {

    const post = await upsertPostProcess(item, p_sfw);    
    
    if(post.has_image === 'quotedPost') {
        qe.emit('quotedPost', post.embed?.record?.uri);
    }
    
    /**
     * SP dont save replies. (reply if: replyParent or replyRoot is not null)
     */
    const sql = `call ${'sp_UPSERT_bsky_post'}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    await pool.execute(sql, post.params);

    return post.safeForWorkScore;
}