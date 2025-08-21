import amqplib from 'amqplib';
const MQ_CONNECTION_STRING = process.env.MQ_CONNECTION_STRING || '-1';
export const mq = {};


export const BSKY_JETSTREAM_EXCHANGE = process.env.BSKY_JETSTREAM_EXCHANGE || 'BSKY_JETSTREAM_EXCHANGE';
export const BSKY_AUTHOR_EXCHANGE = process.env.BSKY_AUTHOR_EXCHANGE || 'BSKY_AUTHOR_EXCHANGE';
export const BSKY_TAG_EXCHANGE = process.env.BSKY_TAG_EXCHANGE || 'BSKY_TAG_EXCHANGE';


async function assertExchanges() {
  mq.ch1.assertExchange(BSKY_JETSTREAM_EXCHANGE, 'fanout', { durable: true });
  mq.ch1.assertExchange(BSKY_AUTHOR_EXCHANGE, 'fanout', { durable: true });
  mq.ch1.assertExchange(BSKY_TAG_EXCHANGE, 'fanout', { durable: true });
}


(async () => {
  await connectMq();
})();


async function connectMq() {
  if (MQ_CONNECTION_STRING === '-1') {
    console.log('[amqplib-connection] MQ_v2_prod_kdn_CONNECTION_STRING is -1');
    mq.ch1 = null;
    return -1;
  }
  try {
    mq.connection = await amqplib.connect(`${MQ_CONNECTION_STRING}`);
    mq.ch1 = await mq.connection.createChannel();
    console.log('[MQ_v2_prod_kdn] asserts...');
    await assertExchanges();
    console.log('[MQ_v2_prod_kdn] asserts OK.');
  } catch (error) {
    console.error('[mq.v2.prod.kdn connectMq()] ERROR', error);
    mq.ch1 = null;
  }
}