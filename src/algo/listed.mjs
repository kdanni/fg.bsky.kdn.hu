import { pool } from './connection/connection.mjs';
import { shortname, FEEDGEN_CONFIG } from '../feed-config/sp-feed/listed.mjs';

const TARGET_AUTHOR_DID = process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID;
// const DEV_ENV = process.env.ENV === 'DEV';

export async function runAlgo(authorDid, listName) {    
    if(!authorDid || authorDid === TARGET_AUTHOR_DID) {
        console.log(`[algo-listed] Skipping algo for ${authorDid}`);
        return;
    }
    listName = listName || 'listed posts';
    try {
        pool.execute(`call ${'SP_listed_post_algo'}(?,?)`, [authorDid, listName]);
    } catch (error) {
        console.error(`[algo-listed] `, 'Error in runAlgo:', error);        
    }
    console.log(`[algo-listed] Finished algo for ${authorDid}`);
    // await initFeedCache(shortname);
    // console.log(`[${shortname}] Cache initialized`);
}

export { shortname, FEEDGEN_CONFIG };