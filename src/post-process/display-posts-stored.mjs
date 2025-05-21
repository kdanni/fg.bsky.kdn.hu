import { pool } from './connection/connection.mjs';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

export async function displayPostsInDb (cursor) {

    cursor = cursor || new Date('2000-01-01');
    
    console.log('cursor', cursor);
    let index = 1;

    while (cursor !== undefined) {

        const sql = `call ${'SP_SELECT_bsky_posts'}(?,?)`;
        const params = [cursor, 50];

        const result = await pool.execute(sql, params);

        if(result[0] && result[0][0] && result[0][0].length && result[0][0].length > 0) {
            for(let post of result[0][0]) {
                if(post.posted_at) {
                    cursor = new Date(post.posted_at)
                }
                DEBUG && console.dir(post);

                let author = `${post.p_author_did}`;
                if(post.a_author_did) {
                    author = `${post.author_displayName||''}@${post.author_handle}`
                }
                let text = `${post.text}`.replace('\n', ' ');

                !DEBUG && console.log(index, post.posted_at,0,`${author}`,0,`${text}`);
                index++;
            }
        } else {
            cursor = undefined;
        }        
    }

}