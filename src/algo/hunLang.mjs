import { pool } from './connection/connection.mjs';

// const DEV_ENV = process.env.ENV === 'DEV';

export async function runAlgo() {
    try {
        pool.execute(`call ${'SP_hun_lang_algo'}()`);
    } catch (error) {
        console.error(`[algo-HunLang] `, 'Error in runAlgo:', error);
    }
    console.log(`[algo-HunLang] Finished algo.`);
    // await initFeedCache(shortname);
    // console.log(`[${shortname}] Cache initialized`);
}
