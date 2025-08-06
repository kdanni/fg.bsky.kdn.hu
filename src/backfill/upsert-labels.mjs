import { getMimeStringOrNull, getLanguageOrEn } from './util.mjs';
import { pool } from './connection/connection.mjs';


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


export async function upsertLabels (item, nsfw) {
    try {
        nsfw = nsfw == true;
        nsfw = nsfw === true ? 1 : 0;

        if(!item?.post?.uri) {
            return;
        }

        if(!item?.post?.record?.labels && item?.post?.labels) {
            item.post.record.labels = item.post.labels;
        }        

        if(item?.post?.record?.labels?.length > 0) {
            for(const label of item.post.record.labels) {
                if(NSFW_LABELS.includes(label.val)) {
                    nsfw = 1;
                    break;
                }
            }
        }
        if(nsfw === 0 && item?.post?.record?.labels?.values?.length > 0) {
            for(const label of item.post.record.labels.values) {
                if(NSFW_LABELS.includes(label.val)) {
                    nsfw = 1;
                    break;
                }
            }
        }


        // CREATE PROCEDURE sp_UPSERT_bsky_post_labels (
        //   url VARCHAR(255),
        //   author_did VARCHAR(255),
        //   text TEXT,
        //   langs VARCHAR(27),
        //   has_image VARCHAR(64),
        //   labels JSON,
        //   custom_labels JSON,
        //   nsfw INT,
        //   posted_at datetime
        // )

        let has_image = getMimeStringOrNull(item?.post?.record?.embed);
        let langs = getLanguageOrEn(item?.post?.record);

        const params = [
            item?.post?.uri||null,
            item?.post?.author?.did||null,
            item?.post?.record?.text||'',
            langs || 'en',
            has_image||null,
            JSON.stringify(item?.post?.record?.labels||null),
            JSON.stringify({}),
            nsfw,
            item?.post?.indexedAt||null,
        ];

        await pool.query('CALL sp_UPSERT_bsky_post_labels(?, ?, ?, ?, ?, ?, ?, ?, ?)', params);

    } catch (error) {
        console.error('[upsertLabels] Error:', error);
    }
}