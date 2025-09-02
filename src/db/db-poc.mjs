import { pool } from './prcEnv.connection.mjs';

export async function runPoc() {

    const posts2 = await pool.query(
        `call ${'sp_SELECT_recent_posts_by_text_and_days'}(?,?)`,
        ['%#🇭🇺%', 10]
    );

    console.log('Posts2:', posts2[0][0]);
}
