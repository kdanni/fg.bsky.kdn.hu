
export const SERVICE_DID = `did:web:${process.env.FEEDGEN_HOSTNAME}`
export const SERVICE_ENDPOINT = `https://${process.env.FEEDGEN_HOSTNAME}`

async function handleRequest (req, res, next) {
    console.log('[.well-known] request');

    res.json({
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: SERVICE_DID,
      service: [
        {
          id: '#bsky_fg',
          type: 'BskyFeedGenerator',
          serviceEndpoint: SERVICE_ENDPOINT,
        },
      ],
    })

    next();
}

export default handleRequest;