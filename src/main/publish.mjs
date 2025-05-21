import { publisFeed } from '../bsky-social/publish-feed.mjs';
import { unpublisFeed } from '../bsky-social/unpublis-feed.mjs';

import {FEEDGEN_CONFIG as followed} from '../algo/followed.mjs';
import {FEEDGEN_CONFIG as listed} from '../algo/listed.mjs';
import {FEEDGEN_CONFIG as f_l} from '../api/xrpc/getFeedSkeleton/followed_or_listed.mjs';
import {FEEDGEN_CONFIG as kdBud} from '../algo/kdanni-Bud.mjs';
import {FEEDGEN_CONFIG as kdPhoto} from '../algo/kdanni-Photo.mjs';
import {FEEDGEN_CONFIG as budHash} from '../algo/budapest-hashtag.mjs';
import {FEEDGEN_CONFIG as magyaroHash} from '../algo/magyarorszag-hashtag.mjs';


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


    process.emit('exit_event');
}