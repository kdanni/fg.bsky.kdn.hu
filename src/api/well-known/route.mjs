import express from 'express';
const router = express.Router();

//MW

import mw from './mw.mjs';

const mwChain = [
    mw
];

router.get('/did.json', mwChain);

export default router;