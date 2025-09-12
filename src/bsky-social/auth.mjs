import got from 'got';

// const BSKY_PUBLIC_API_ROOT = process.env.BSKY_PUBLIC_API_ROOT || 'https://public.api.bsky.app';
const BSKY_SOCIAL_ROOT = process.env.BSKY_SOCIAL_ROOT || 'https://bsky.social';

const DEV_ENV = process.env.ENV === 'DEV';
const DEBUG = process.env.DEBUG === 'true' || false;

const AUTH_TOKEN_CACHE = {};


export async function getAuthToken(handle, appPassword) {
    if(AUTH_TOKEN_CACHE[handle]) {
        DEV_ENV && console.log(`[getAuthToken] Using cached token for handle: ${handle}`);
        return AUTH_TOKEN_CACHE[handle];
    }
    DEV_ENV && console.log(`[getAuthToken] Getting new token for handle: ${handle}`);
    try {
        const url = `${BSKY_SOCIAL_ROOT}/xrpc/com.atproto.server.createSession`;
        const response = await got.post(url, {
            json: {
                identifier: handle,
                password: appPassword,
            },
            responseType: 'json',
            resolveBodyOnly: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        if(response && response.accessJwt) {
            if(!response.active){
                throw new Error('Token is not active');
            }
            DEV_ENV && console.log(`[getAuthToken] Token found for handle: ${handle}`);
            DEBUG && console.dir(response, { depth: null });
            AUTH_TOKEN_CACHE[handle] = {
                accessJwt: response.accessJwt,
                refreshJwt: response.refreshJwt,
                did: response.did,
            };
            return AUTH_TOKEN_CACHE[handle];
        }

    } catch (error) {
        console.error('[getAuthToken] Error:', error);
        return {accessJwt: null, refreshJwt: null, did: null, errorMessage: `${error}`};
    }
}
