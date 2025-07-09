import { createConnection as cc, multipleStatementConnection as msc, pool as p } 
    from '../../../../db/prcEnv.connection.mjs';

export const createConnection = cc;
export const multipleStatementConnection = msc;
export const pool = p;