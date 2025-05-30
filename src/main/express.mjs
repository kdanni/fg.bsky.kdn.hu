import appName from '../app.mjs';
import express from 'express';
import { errorHandler } from './../api/error-mw.mjs';

const app = express();
const port = process.env.FEEDGEN_PORT || process.env.PORT || 8879;

app.get('/', (req, res) => {
    res.send(`${appName.appName}`);
});

app.listen(port, () => {
    console.log(`${appName.appName} listening at *:${port}`);
});

import wellKnown from '../api/well-known/route.mjs';
app.use('/.well-known', wellKnown);


import xrpc from '../api/xrpc/route.mjs';
app.use('/xrpc', xrpc);
app.use(errorHandler);