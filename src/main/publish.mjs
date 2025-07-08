import { publisFeed } from '../bsky-social/publish-feed.mjs';
import { unpublisFeed } from '../bsky-social/unpublis-feed.mjs';
import { updateFeed } from '../bsky-social/update-feed-repo-object.mjs';


import {FEEDGEN_CONFIG as followed} from '../algo/followed.mjs';
import {FEEDGEN_CONFIG as listed} from '../algo/listed.mjs';
import {FEEDGEN_CONFIG as f_l} from '../api/xrpc/getFeedSkeleton/followed_or_listed.mjs';
import {FEEDGEN_CONFIG as kdBud} from '../algo/kdanni-Bud.mjs';
import {FEEDGEN_CONFIG as kdPhoto} from '../algo/kdanni-Photo.mjs';
import {FEEDGEN_CONFIG as budHash} from '../algo/budapest-hashtag.mjs';
import {FEEDGEN_CONFIG as magyaroHash} from '../algo/magyarorszag-hashtag.mjs';
import {FEEDGEN_CONFIG as cf} from '../algo/kdanni-CustomFeed.mjs';
import {FEEDGEN_CONFIG as tractor} from '../algo/tractor-hashtag.mjs';
import {FEEDGEN_CONFIG as notUrbanEx } from '../algo/not-urban-ex.mjs';
import {FEEDGEN_CONFIG as musEj } from '../algo/kdanni-MusEj.mjs';
import {FEEDGEN_CONFIG as nsfw } from '../algo/nsfw.mjs';
import { FEEDGEN_CONFIG as brutalism } from '../algo/brutalism-hashtag.mjs';
import { FEEDGEN_CONFIG as UBT } from '../api/xrpc/getFeedSkeleton/urban-brutal-tractor.mjs';


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

    process.emit('exit_event');

}