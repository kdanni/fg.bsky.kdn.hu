import {pool} from '../db/prcEnv.connection.mjs';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

export const artistListedDictionary = {};
export const aiListedDictionary = {};
export const nsfwListedDictionary = {};


export async function updateArtistsMimeTag () {
    for (const did in artistListedDictionary) {
        DEBUG && console.log(`Updating artist MIME tag for DID: ${did}`);
        const sql = 'call SP_tag_MIME(?,?)'
        const params = [did, 'ARTWORK'];
        await pool.query(sql, params);
    }
    console.log(`Updated ${Object.keys(artistListedDictionary).length} artists MIME tags.`);
}

export async function updateAiMimeTag () {
    for (const did in aiListedDictionary) {
        DEBUG && console.log(`Updating AI MIME tag for DID: ${did}`);
        const sql = 'call SP_tag_MIME(?,?)'
        const params = [did, 'AIART'];
        await pool.query(sql, params);
    }
    console.log(`Updated ${Object.keys(aiListedDictionary).length} AI MIME tags.`);
}
