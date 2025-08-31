import { publisFeed } from '../bsky-social/publish-feed.mjs';
import { unpublisFeed } from '../bsky-social/unpublis-feed.mjs';
import { updateFeed } from '../bsky-social/update-feed-repo-object.mjs';


import {FEEDGEN_CONFIG as followed} from '../algo/followed.mjs';
import {FEEDGEN_CONFIG as listed} from '../algo/listed.mjs';
import {FEEDGEN_CONFIG as favorites } from '../algo/favorites.mjs';
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
import { FEEDGEN_CONFIG as waterscape } from '../algo/waterscape.mjs';
import { FEEDGEN_CONFIG as treelandwater } from '../algo/treescape-landscape-waterscape.mjs';

import { FEEDGEN_CONFIG as nsfw_scored } from '../feed-config/nsfw-scored.mjs';


async function doPublishCommand(feedConfig, command) {
    if(command === 'publish') {
        await publisFeed(feedConfig);
    }
    if(command === 'unpublish') {
        await unpublisFeed(feedConfig);
    }
    if(command === 'republish') {
        await updateFeed(feedConfig);
    }    
}


export async function doPublish(commandString) {
    const match = /^((re|un)?publish)\b +(\S+)/.exec(commandString) || [commandString, null];

    if(match[3] === null) {
        process.emit('exit_event');
    }
    const feedName = `${match[3]}`.trim();
    const command = match[1];

    if(feedName == 'followed') {
        await doPublishCommand(followed, command);
    }
    if(feedName == 'listed') {
        await doPublishCommand(listed, command);
    }
    if(feedName == 'f_l') {
        await doPublishCommand(f_l, command);
    }
    if(feedName == 'kdBud') {
        await doPublishCommand(kdBud, command);
    }
    if(feedName == 'kdPhoto') {
        await doPublishCommand(kdPhoto, command);
    }
    if(feedName == 'bud_hash') {
        await doPublishCommand(budHash, command);
    }
    if(feedName == 'magyaro_hash') {
        await doPublishCommand(magyaroHash, command);
    }
    if(feedName == 'kdCustomFeed') {
        await doPublishCommand(cf, command);
    }
    if(feedName == 'tractor') {
        await doPublishCommand(tractor, command);
    }
    if(/notUrbanEx/i.test(feedName)) {
        await doPublishCommand(notUrbanEx, command);
    }
    if(feedName == 'musEj') {
        await doPublishCommand(musEj, command);
    }
    if(feedName == 'nsfw') {
        await doPublishCommand(nsfw, command);
    }
    if(feedName == 'brutalism') {
        await doPublishCommand(brutalism, command);
    }
    if(feedName == 'urban-brutal-tractor' || feedName == 'UBT') {
        await doPublishCommand(UBT, command);
    }
    if(feedName == 'socialist-modernism' || feedName == 'SM') {
        await doPublishCommand(SM, command);
    }
    if(feedName == 'food-images' || feedName == 'FOOD') {
        await doPublishCommand(FOOD, command);
    }
    if(feedName == 'kdanni-out-of-Bud') {
        await doPublishCommand(kdOutofBud, command);
    }
    if(feedName == 'kdanni-Bud-Out-of-Bud') {
        await doPublishCommand(kdBudOutofBud, command);
    }
    if(feedName == 'landscape') {
        await doPublishCommand(LANDSCAPE, command);
    }
    if(feedName == 'treescape') {
        await doPublishCommand(TREESCAPE, command);
    }
    if(feedName == 'budapest-all') {
        await doPublishCommand(budapestAll, command);
    }
    if(feedName == 'budapest-meetings') {
        await doPublishCommand(budapestMeetings, command);
    }
    if(feedName == 'budapest-jobs') {   
        await doPublishCommand(budapestJobs, command);
    }
    if(feedName == 'railway') {
        await doPublishCommand(railway, command);
    }
    if(feedName == 'waterscape') {
        await doPublishCommand(waterscape, command);
    }
    if(feedName == 'treelandwater') {
        await doPublishCommand(treelandwater, command);
    }
    if(feedName == 'favorites') {
        await doPublishCommand(favorites, command);
    }   
    if(nsfw_scored.commandlineRegex.test(feedName)) {
        await doPublishCommand(nsfw_scored, command);
    }
    process.emit('exit_event');
}


export async function publish(commandString) {
    const match = /^publish\b +(\S+)/.exec(commandString) || [commandString, null];

    if(match[1] === null) {
        process.emit('exit_event');
    }

    await doPublish(commandString);
}


export async function unpublish(commandString) {
    const match = /^unpublish\b +(\S+)/.exec(commandString) || [commandString, null];

    if(match[1] === null) {
        process.emit('exit_event');
    }

    await doPublish(commandString);
}

export async function republish(commandString) {
    // console.log('function republish(commandString)', commandString);
    const match = /^republish\b +(\S+)/.exec(commandString) || [commandString, null];

    if(match[1] === null) {
        process.emit('exit_event');
    }

    await doPublish(commandString);
}