import emitter from '../event-emitter.mjs';

import {pool} from '../db/prcEnv.connection.mjs';

async function handleCustomFeedLogic({ pageContent }) {
    console.log(`[WIKI-CUSTOM-FEED-LOGIC-HANDLER] Processing page: ${pageContent.title}`);
    // Process the pageContent as needed

    // console.dir(pageContent, { depth: null });

    const {title, revid, pageLinesArray} = pageContent;
    if (!title || !revid || !pageLinesArray || pageLinesArray.length === 0) {
        console.warn(`[WIKI-CUSTOM-FEED-LOGIC-HANDLER] Missing required pageContent properties`);
        return;
    }

    console.log(`[WIKI-CUSTOM-FEED-LOGIC-HANDLER] Title: ${title}, Revision ID: ${revid}`);
    console.log(`[WIKI-CUSTOM-FEED-LOGIC-HANDLER] Page Lines: ${pageLinesArray.join('\n')}`);

    const feedShortname = `${title}`.split('/').pop();

    if(!feedShortname) {
        console.warn(`[WIKI-CUSTOM-FEED-LOGIC-HANDLER] Missing feedShortname`);
        return;
    }

    console.log(`[WIKI-CUSTOM-FEED-LOGIC-HANDLER] Feed Shortname: ${feedShortname}`);

    let imageRegexString = null;
    let authorDidArray = [];
    let positiveFilter = [];
    let negativeFilter = [];
    let sfwLimit = 2;
    let sfwScore = 10;

    for(let line of pageLinesArray) {
        // Analyze each line and update filters and scores accordingly
        if(line.startsWith('§')) {
            console.log(`[WIKI-CUSTOM-FEED-LOGIC-HANDLER] Found config param line: ${line}`);
            if(line.startsWith('§i')) { 
                imageRegexString = line.slice(2).trim();
            } else if (line.startsWith('§sfw')) { 
                let sfw = line.slice(4).trim();
                if(sfw.includes('/')) {
                    [sfwScore,sfwLimit] = sfw.split('/').map(Number);
                } else {
                    sfwLimit = Number(sfw);
                }
            } else if (line.startsWith('§@')) {
                let authorDid = line.slice(2).trim();
                authorDidArray.push(authorDid);
            }
        } else {
            console.log(`[WIKI-CUSTOM-FEED-LOGIC-HANDLER] Found filter line: ${line}`);
            if(line.startsWith('¤')) {
                let filter = line.slice(1).trim();                
                negativeFilter.push(filter);                
            } else {
                positiveFilter.push(line.trim());
            }
        }
    }

    const data = {
        title,
        revid,
        feedShortname,
        imageRegexString,
        authorDidArray,
        positiveFilter,
        negativeFilter,
        sfwLimit,
        sfwScore
    };

    console.log(`[WIKI-CUSTOM-FEED-LOGIC-HANDLER] Processed data:`, data);

    const sql = 'call upsert_custom_feed_logic(?,?,?,?,?)';
    const params = [feedShortname, JSON.stringify(data), imageRegexString||null, sfwScore||10, sfwLimit||2]
    await pool.query(sql, params);
}

emitter.on('customFeedLogic', async (event) => {
    handleCustomFeedLogic(event).catch(err => {
        console.error(`[WIKI-CUSTOM-FEED-LOGIC-HANDLER] Error processing event:`, err);
    });
});