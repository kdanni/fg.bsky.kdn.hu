import { pool } from './connection/connection.mjs';

// const DEV_ENV = process.env.ENV === 'DEV';

export async function runAlgo() {
    try {
        pool.execute(`call ${'SP_notUrbanEx18_algo'}()`);
    } catch (error) {
        console.error(`[algo-.notUrbanEx18] `, 'Error in runAlgo:', error);
    }
    console.log(`[algo-.notUrbanEx18] Finished algo.`);
    // await initFeedCache(shortname);
    // console.log(`[${shortname}] Cache initialized`);
}
