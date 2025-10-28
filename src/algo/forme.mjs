import { pool } from './connection/connection.mjs';

// const DEV_ENV = process.env.ENV === 'DEV';

export async function runAlgo() {
    try {
        pool.execute(`call ${'SP_forme_author_algo'}()`);
    } catch (error) {
        console.error(`[algo-forme_author_algo] `, 'Error in runAlgo:', error);
    }
    console.log(`[algo-forme] Finished algo.`);
    // await initFeedCache(shortname);
    // console.log(`[${shortname}] Cache initialized`);
}
