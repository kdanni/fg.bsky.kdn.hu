import { pool } from './connection/connection.mjs';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

export async function displayPostsInDb () {

    let cursor = new Date('2000-01-01');
    
    console.log('cursor', cursor);

    while (cursor !== undefined) {

        const sql = `call ${'SP_SELECT_bsky_posts'}(?,?)`;
        const params = [cursor, 50];

        const result = await pool.execute(sql, params);

        if(result[0] && result[0][0] && result[0][0].length) {
            for(let post of result[0][0]) {
                console.dir(post);
            }
        }

        cursor = undefined;
    }

}