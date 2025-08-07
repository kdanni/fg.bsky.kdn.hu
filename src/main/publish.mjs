import { publisFeed } from '../bsky-social/publish-feed.mjs';
import { unpublisFeed } from '../bsky-social/unpublis-feed.mjs';
import { updateFeed } from '../bsky-social/update-feed-repo-object.mjs';


import {FEEDGEN_CONFIG as followed} from '../algo/followed.mjs';
import {FEEDGEN_CONFIG as listed} from '../algo/listed.mjs';
import {FEEDGEN_CONFIG as f_l} from '../algo/followed_or_listed.mjs';
import {FEEDGEN_CONFIG as kdBud} from '../algo/kdanni-Bud.mjs';
import {FEEDGEN_CONFIG as kdPhoto} from '../algo/kdanni-Photo.mjs';
import {FEEDGEN_CONFIG as budHash} from '../algo/budapest-hashtag.mjs';
import {FEEDGEN_CONFIG as kdOutofBud} from '../algo/kdanni-out-of-Bud.mjs';
import {FEEDGEN_CONFIG as kdBudOutofBud} from '../algo/kdanni-Bud-Out-of-Bud.mjs';
import {FEEDGEN_CONFIG as magyaroHash} from '../algo/magyarorszag-hashtag.mjs';
import {FEEDGEN_CONFIG as cf} from '../algo/kdanni-CustomFeed.mjs';
import {FEEDGEN_CONFIG as tractor} from '../algo/tractor-hashtag.mjs';
import {FEEDGEN_CONFIG as notUrbanEx } from '../algo/not-urban-ex.mjs';
import {FEEDGEN_CONFIG as musEj } from '../algo/kdanni-MusEj.mjs';
import {FEEDGEN_CONFIG as nsfw } from '../algo/nsfw.mjs';
import { FEEDGEN_CONFIG as brutalism } from '../algo/brutalism-hashtag.mjs';
import { FEEDGEN_CONFIG as UBT } from '../algo/urban-brutal-tractor.mjs';
import { FEEDGEN_CONFIG as SM } from '../algo/socialist-modernism.mjs';
import { FEEDGEN_CONFIG as FOOD } from '../algo/food-images.mjs';
import { FEEDGEN_CONFIG as LANDSCAPE } from '../algo/landscape.mjs';
import { FEEDGEN_CONFIG as TREESCAPE } from '../algo/treescape.mjs';
import { FEEDGEN_CONFIG as budapestAll } from '../algo/budapest-all.mjs';
import { FEEDGEN_CONFIG as budapestMeetings } from '../algo/budapest-meetings.mjs';
import { FEEDGEN_CONFIG as budapestJobs } from '../algo/budapest-jobsearch.mjs';
import { FEEDGEN_CONFIG as railway } from '../algo/railway.mjs';

export async function publish(commandString) {
    const match = /^publish\b +(\S+)/.exec(commandString) || [commandString, null];

    if(match[1] === null) {
        process.emit('exit_event');
    }
    const feedName = `${match[1]}`.trim();

    
    if(feedName == 'followed') {
        await publisFeed(followed);
    }
    if(feedName == 'listed') {
        await publisFeed(listed);
    }    
    if(feedName == 'f_l') {
        await publisFeed(f_l);
    }
    if(feedName == 'kdBud') {
        await publisFeed(kdBud);
    }
    if(feedName == 'kdPhoto') {
        await publisFeed(kdPhoto);
    }
    if(feedName == 'bud_hash') {
        await publisFeed(budHash);
    }
    if(feedName == 'magyaro_hash') {
        await publisFeed(magyaroHash);
    }
    if(feedName == 'kdCustomFeed') {
        await publisFeed(cf);
    }
    if(feedName == 'tractor') {
        await publisFeed(tractor);
    }
    if(/notUrbanEx/i.test(feedName)) {
        await publisFeed(notUrbanEx);
    }
    if(feedName == 'musEj') {
        await publisFeed(musEj);
    }
    if(feedName == 'nsfw') {
        await publisFeed(nsfw);
    }
    if(feedName == 'brutalism') {
        await publisFeed(brutalism);
    }
    if(feedName == 'urban-brutal-tractor' || feedName == 'UBT') {
        await publisFeed(UBT);
    }
    if(feedName == 'socialist-modernism' || feedName == 'SM') {
        await publisFeed(SM);
    }
    if(feedName == 'food-images' || feedName == 'FOOD') {
        await publisFeed(FOOD);
    }
    if(feedName == 'kdanni-out-of-Bud') {
        await publisFeed(kdOutofBud);
    }
    if(feedName == 'kdanni-Bud-Out-of-Bud') {
        await publisFeed(kdBudOutofBud);
    }
    if(feedName == 'landscape') {
        await publisFeed(LANDSCAPE);
    }
    if(feedName == 'treescape') {
        await publisFeed(TREESCAPE);
    }
    if(feedName == 'budapest-all') {
        await publisFeed(budapestAll);
    }
    if(feedName == 'budapest-meetings') {
        await publisFeed(budapestMeetings);
    }
    if(feedName == 'budapest-jobs') {   
        await publisFeed(budapestJobs);
    }
    if(feedName == 'railway') {
        await publisFeed(railway);
    }
    process.emit('exit_event');
}


export async function unpublish(commandString) {
    const match = /^unpublish\b +(\S+)/.exec(commandString) || [commandString, null];

    if(match[1] === null) {
        process.emit('exit_event');
    }
    const feedName = `${match[1]}`.trim();


    if(feedName == 'followed') {
        await unpublisFeed(followed);
    }
    if(feedName == 'listed') {
        await unpublisFeed(listed);
    }    
    if(feedName == 'f_l') {
        await unpublisFeed(f_l);
    }
    if(feedName == 'kdBud') {
        await unpublisFeed(kdBud);
    }
    if(feedName == 'kdPhoto') {
        await unpublisFeed(kdPhoto);
    }
    if(feedName == 'bud_hash') {
        await unpublisFeed(budHash);
    }    
    if(feedName == 'magyaro_hash') {
        await unpublisFeed(magyaroHash);
    }
    if(feedName == 'kdCustomFeed') {
        await unpublisFeed(cf);
    }
    if(feedName == 'tractor') {
        await unpublisFeed(tractor);
    }
    if(/notUrbanEx/i.test(feedName)) {
        await unpublisFeed(notUrbanEx);
    }
    if(feedName == 'musEj') {
        await unpublisFeed(musEj);
    }
    if(feedName == 'nsfw') {
        await unpublisFeed(nsfw);
    }
    if(feedName == 'brutalism') {
        await unpublisFeed(brutalism);
    }
    if(feedName == 'urban-brutal-tractor' || feedName == 'UBT') {
        await unpublisFeed(UBT);
    }
    if(feedName == 'socialist-modernism' || feedName == 'SM') {
        await unpublisFeed(SM);
    }
    if(feedName == 'food-images' || feedName == 'FOOD') {
        await unpublisFeed(FOOD);
    }
    if(feedName == 'kdanni-out-of-Bud') {
        await unpublisFeed(kdOutofBud);
    }
    if(feedName == 'kdanni-Bud-Out-of-Bud') {
        await unpublisFeed(kdBudOutofBud);
    }
    if(feedName == 'landscape') {
        await unpublisFeed(LANDSCAPE);
    }
    if(feedName == 'treescape') {
        await unpublisFeed(TREESCAPE);
    }
    if(feedName == 'budapest-all') {
        await unpublisFeed(budapestAll);
    }
    if(feedName == 'budapest-meetings') {
        await unpublisFeed(budapestMeetings);
    }
    if(feedName == 'budapest-jobs') {       
        await unpublisFeed(budapestJobs);
    }
    if(feedName == 'railway') {
        await unpublisFeed(railway);
    }
    process.emit('exit_event');
}

export async function republish(commandString) {
    // console.log('function republish(commandString)', commandString);
    const match = /^republish\b +(\S+)/.exec(commandString) || [commandString, null];

    if(match[1] === null) {
        process.emit('exit_event');
    }
    const feedName = `${match[1]}`.trim();

    
    if(feedName == 'followed') {
        await updateFeed(followed);
    }
    if(feedName == 'listed') {
        await updateFeed(listed);
    }    
    if(feedName == 'f_l') {
        await updateFeed(f_l);
    }
    if(feedName == 'kdBud') {
        await updateFeed(kdBud);
    }
    if(feedName == 'kdPhoto') {
        await updateFeed(kdPhoto);
    }
    if(feedName == 'bud_hash') {
        await updateFeed(budHash);
    }
    if(feedName == 'magyaro_hash') {
        await updateFeed(magyaroHash);
    }
    if(feedName == 'kdCustomFeed') {
        await updateFeed(cf);
    }
    if(feedName == 'tractor') {
        await updateFeed(tractor);
    }
    if(/notUrbanEx/i.test(feedName)) {
        await updateFeed(notUrbanEx);
    }
    if(feedName == 'musEj') {
        await updateFeed(musEj);
    }
    if(feedName == 'nsfw') {
        await updateFeed(nsfw);
    }
    if(feedName == 'brutalism') {
        await updateFeed(brutalism);
    }
    if(feedName == 'urban-brutal-tractor' || feedName == 'UBT') {
        await updateFeed(UBT);
    }
    if(feedName == 'socialist-modernism' || feedName == 'SM') {
        await updateFeed(SM);
    }
    if(feedName == 'food-images' || feedName == 'FOOD') {
        await updateFeed(FOOD);
    }
    if(feedName == 'kdanni-out-of-Bud') {
        await updateFeed(kdOutofBud);
    }
    if(feedName == 'kdanni-Bud-Out-of-Bud') {
        await updateFeed(kdBudOutofBud);
    }
    if(feedName == 'landscape') {
        await updateFeed(LANDSCAPE);
    }
    if(feedName == 'treescape') {
        await updateFeed(TREESCAPE);
    }
    if(feedName == 'budapest-all') {
        await updateFeed(budapestAll);
    }
    if(feedName == 'budapest-meetings') {
        await updateFeed(budapestMeetings);
    }
    if(feedName == 'budapest-jobs') {       
        await updateFeed(budapestJobs);
    }
    if(feedName == 'railway') {
        await updateFeed(railway);
    }
    process.emit('exit_event');

}