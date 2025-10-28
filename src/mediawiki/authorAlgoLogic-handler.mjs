import emitter from '../event-emitter.mjs';

import {pool} from '../db/prcEnv.connection.mjs';

async function handleAuthorFeedLogic({ pageContent }) {
    console.log(`[WIKI-AUTHOR-ALGO-LOGIC-HANDLER] Processing page: ${pageContent.title}`);
    // Process the pageContent as needed

    // console.dir(pageContent, { depth: null });

    let doDelete = false;

    const {title, revid, pageLinesArray} = pageContent;
    if (!title || !revid || !pageLinesArray || pageLinesArray.length === 0) {
        console.warn(`[WIKI-AUTHOR-ALGO-LOGIC-HANDLER] Missing required pageContent properties`);
        return;
    }

    console.log(`[WIKI-AUTHOR-ALGO-LOGIC-HANDLER] Title: ${title}, Revision ID: ${revid}`);
    console.log(`[WIKI-AUTHOR-ALGO-LOGIC-HANDLER] Page Lines: ${pageLinesArray.join('\n')}`);

    const feedShortname = `${title}`.split('/').pop();

    if(!feedShortname) {
        console.warn(`[WIKI-AUTHOR-ALGO-LOGIC-HANDLER] Missing feedShortname`);
        return;
    }

    console.log(`[WIKI-AUTHOR-ALGO-LOGIC-HANDLER] Feed Shortname: ${feedShortname}`);

    const actor = feedShortname.startsWith('@') ? feedShortname.substring(1) : `${feedShortname}`;

    const bsky_author = await pool.execute('SELECT * FROM bsky_author WHERE did = ? OR handle = ?', [actor, actor]);
    
    // console.dir(bsky_author[0], {depth: null});

    let imageRegexString = '.*';
    let authorDidArray = [];
    let positiveFilter = [];
    let negativeFilter = [];
    let doubleNegativeFilter = [];
    let sfwLimit = 2;
    let sfwScore = 10;

    if(bsky_author[0] && bsky_author[0][0]) {
        let d = bsky_author[0][0].did;
        if(d) {
            authorDidArray.push(d);
        }
    }

    for(let line of pageLinesArray) {
        // Analyze each line and update filters and scores accordingly
        if(line.startsWith('§')) {
            console.log(`[WIKI-AUTHOR-ALGO-LOGIC-HANDLER] Found config param line: ${line}`);
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
            } else if (line.startsWith('§§DELETE')) {
                doDelete = true;
                break;
            }
        } else {
            // console.log(`[WIKI-AUTHOR-ALGO-LOGIC-HANDLER] Found filter line: ${line}`);
            if(line.startsWith('¤¤')) {
                let filter = line.slice(2).trim();
                doubleNegativeFilter.push(filter);
            } else if(line.startsWith('¤')) {
                let filter = line.slice(1).trim();                
                negativeFilter.push(filter);                
            } else {
                positiveFilter.push(line.trim());
            }
        }
    }
    if(doDelete) {
        const sql = 'DELETE FROM author_algo_logic WHERE feed_name = ?';
        const params = [feedShortname];
        await pool.query(sql, params);
        return;
    }

    const data = {
        title,
        revid,
        feedShortname,
        imageRegexString,
        authorDidArray,
        positiveFilter,
        negativeFilter,
        doubleNegativeFilter,
        sfwLimit,
        sfwScore
    };

    console.log(`[WIKI-AUTHOR-ALGO-LOGIC-HANDLER] Processed data:`, data);

    const sql = 'call upsert_author_algo_logic(?,?,?,?,?)';
    const params = [feedShortname, JSON.stringify(data), imageRegexString||null, sfwScore||10, sfwLimit||2]
    await pool.query(sql, params);
}

emitter.on('authorAlgoLogic', async (event) => {
    handleAuthorFeedLogic(event).catch(err => {
        console.error(`[WIKI-AUTHOR-ALGO-LOGIC-HANDLER] Error processing event:`, err);
    });
});