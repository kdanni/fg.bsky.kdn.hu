import express from 'express';
const router = express.Router();

//MW

import serviceDidMw from './service-did-mw.mjs';

const serviceDidMwChain = [
    serviceDidMw
];

router.get('/did.json', serviceDidMwChain);

export default router;