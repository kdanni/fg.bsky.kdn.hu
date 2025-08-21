import { getMimeStringOrNull, getLanguageOrEn, getSafeForWorkScore, isArtwork } from './util.mjs';
import { pool } from './connection/connection.mjs';


export async function upsertPost(item, p_sfw = 10) {

    let has_image = getMimeStringOrNull(item?.post?.record?.embed);
    has_image = isArtwork(item, has_image);
    let langs = getLanguageOrEn(item?.post?.record);

    let replyParent = item?.post?.record?.reply?.parent?.uri || null;
    let replyRoot = item?.post?.record?.reply?.root?.uri || null;

    let safeForWorkScore = getSafeForWorkScore(item);
    safeForWorkScore = Math.min(safeForWorkScore, p_sfw);
    
    /**
     * SP dont save replies. (reply if: replyParent or replyRoot is not null)
     */
    const sql = `call ${'sp_UPSERT_bsky_post'}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    // url VARCHAR(255),
    // cid VARCHAR(255),
    // author_did VARCHAR(255),
    // reply_to_cid VARCHAR(255),
    // text TEXT,
    // facets JSON,
    // embeds JSON,
    // labels JSON,
    // has_image VARCHAR(64),
    // sfw INT,
    // posted_at datetime,
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
        item?.post?.indexedAt||null,
    ];
    pool.execute(sql, params);

    return safeForWorkScore;
}