const WIKI_BOT_API = process.env.WIKI_BOT_API
const WIKI_BOT_NAME = process.env.WIKI_BOT_NAME
const WIKI_BOT_PASS = process.env.WIKI_BOT_PASS

const WIKI_NAMESPACENUM = process.env.WIKI_NAMESPACENUM;
const WIKI_SEARCH_QUERY_PAGE_PREFIX = process.env.WIKI_SEARCH_QUERY_PAGE_PREFIX || 'Bsky:App/SearchQuery/';
const WIKI_CUSTOM_FEED_LOGIC_PAGE_PREFIX = process.env.WIKI_CUSTOM_FEED_LOGIC_PAGE_PREFIX || 'Bsky:App/CustomFeed/';

import {pool} from '../db/prcEnv.connection.mjs';

/** HTTP **/

import { CookieJar } from 'tough-cookie';
import got from 'got';
const cookieJar = new CookieJar();

/** util **/

import emitter from '../event-emitter.mjs';
import './customFeedLogic-handler.mjs';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


/** Service **/

export async function upsertCustomFeedLogic () {
    console.log(`[WIKI-CUSTOM-FEED-LOGIC-UPSERT] Start`);
    await wikiLogin();
    console.log(`[WIKI-CUSTOM-FEED-LOGIC-UPSERT] Logged in`);
    const allPages = await listPagesInNamespace(WIKI_NAMESPACENUM);
    for (const page of allPages || []) {
        if(!page.title.startsWith(`${WIKI_CUSTOM_FEED_LOGIC_PAGE_PREFIX}`)) {
            continue;
        }
        const pageContent = await getWikiPageText(page);
        if(pageContent?.pageLinesArray?.length) {
            emitter.emit('customFeedLogic', { pageContent });
        } // END pageContent?.pageLinesArray?.length
        await delay(1000);
    } // END for allpages
}

export async function upsertQuerySearchTerms () {
    console.log(`[WIKI-SEARCH-QUERY-UPSERT] Start`);
    await wikiLogin();
    console.log(`[WIKI-SEARCH-QUERY-UPSERT] Logged in`);
    const allPages = await listPagesInNamespace(WIKI_NAMESPACENUM);
    for (const page of allPages || []) {
        if(!page.title.startsWith(`${WIKI_SEARCH_QUERY_PAGE_PREFIX}`)) {
            continue;
        }
        const match = /.*[- _](\d+)$/.exec(page.title) || ['10','10'];
        const sfwScore = parseInt(match[1], 10);
        console.log(`[WIKI-SEARCH-QUERY-UPSERT] Processing page: ${page.title} (sfwScore: ${sfwScore})`);
        const pageContent = await getWikiPageText(page);
        if(pageContent?.pageLinesArray?.length) {
            const title = pageContent.title;
            const revid = pageContent.revid;
            for( const line of pageContent.pageLinesArray) {
                if ( line?.length > 0) {
                    // upsert_backfill_search_query (
                    //   IN p_query VARCHAR(255),
                    //   IN p_data JSON,
                    //   IN p_sfw INT
                    // )
                    if(`${line}`.startsWith('¤')){
                        const q = `${line}`.slice(1);
                        const sql = 'DELETE FROM backfill_search_query WHERE query = ?';
                        const params = [q];
                        try {
                            await pool.query(sql, params);
                        } catch (err) {
                            console.error(`[err-WIKI-SEARCH-QUERY-UPSERT] ${err}`, err);
                        }
                    } else {
                        const sql = 'call upsert_backfill_search_query(?,?,?)';
                        const params = [`${line}`, JSON.stringify({ title, revid }), sfwScore];
                        try {
                            await pool.query(sql, params);
                        } catch (err) {
                            console.error(`[err-WIKI-SEARCH-QUERY-UPSERT] ${err}`, err);
                        }
                    }
                }
            }
        } // END pageContent?.pageLinesArray?.length
        await delay(1000);
    } // END for allpages
}

async function getWikiPageText(pageData) {
    if (!pageData?.title) {
        throw 'Page title is required';
    }

     const wikiPageWikiText = await got(WIKI_BOT_API,
        {
            searchParams: {
                action: 'parse',
                format: 'json',
                page: pageData.title,
                prop: 'revid|wikitext'
            }, cookieJar
        }
    );
    let { body } = wikiPageWikiText;
    body = JSON.parse(body);
    let configPage = body?.parse;
    let { title, revid, wikitext } = configPage;
    let pageLinesArray = [];
    if (wikitext && wikitext['*']) {
        pageLinesArray = `${wikitext['*']}`.match(/[^\r\n]+/g);        
    }
    return { title, revid, wikitext, pageLinesArray };
}


async function listPagesInNamespace(namespaceNum) {
    if(!namespaceNum) {
        throw 'Namespace number is required';
    }
    const allpages = [];
    let lastContinue = {};
    while (lastContinue) {
        const wikiPageWikiText = await got(WIKI_BOT_API,
            {
                searchParams: {
                    action: 'query',
                    format: 'json',
                    list: 'allpages',
                    apnamespace: `${namespaceNum}`,
                    apcontinue: lastContinue?.apcontinue,
                    continue: lastContinue?.continue,
                    aplimit: 'max',
                }, cookieJar
            }
        );
        let { body } = wikiPageWikiText;
        body = JSON.parse(body);

        // console.dir(body, {depth: null});

        for (const page of body?.query?.allpages || []) {
            allpages.push(page);
        }

        lastContinue = body?.continue || null;
        await delay(100);
    }
    return allpages;
}


async function wikiLogin() {
    const gotUserStatus = await got(WIKI_BOT_API,
        {
            searchParams: {
                action: 'query',
                meta: 'tokens',
                type: 'login',
                format: 'json'
            }, cookieJar
        }
    );
    let { body } = gotUserStatus;
    body = JSON.parse(body);
    const token = body?.query?.tokens?.logintoken;

    if (token) {
        //Do login
        const gotLoginResult = await got.post(WIKI_BOT_API,
            {
                form: {
                    action: 'login',
                    lgname: WIKI_BOT_NAME,
                    lgpassword: WIKI_BOT_PASS,
                    lgtoken: token,
                    format: 'json'
                }, cookieJar
            }
        );
        let { body } = gotLoginResult;
        body = JSON.parse(body);
        if (body?.login?.result === 'Success') {
            return 0;
        } //END Success
    }

    throw 'Wiki Login failed!';
}