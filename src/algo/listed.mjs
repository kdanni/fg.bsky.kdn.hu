import { pool } from './connection/connection.mjs';

const TARGET_AUTHOR_DID = process.env.KDANNI_DID || process.env.FEEDGEN_PUBLISHER_DID;
const DEV_ENV = process.env.ENV === 'DEV';
    

export async function runAlgo(authorDid) {    
    if(!authorDid || authorDid === TARGET_AUTHOR_DID) {
        console.log(`[algo-listed] Skipping algo for ${authorDid}`);
        return;
    }
    try {
        

    } catch (error) {
        console.error(`[algo-listed] `, 'Error in runAlgo:', error);        
    }
    console.log(`[algo-listed] Finished algo for ${authorDid}`);
}