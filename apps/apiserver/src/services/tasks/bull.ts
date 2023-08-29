import { Queue } from 'bullmq';

import { commonRedisOptions } from '../../constants/commonRedisOptions';
import { workerWithResources } from './workerWithResources';

const connection = {
  ...commonRedisOptions,
  db: 3,
};

let initialized = false;

export const init = async () => {
  if (initialized) {
    return;
  }
  initialized = true;
  const queue = new Queue('main', {
    connection,
    defaultJobOptions: {
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 1000 },
    },
  });
  const worker = workerWithResources('main', { connection });
  await queue.add('hello', {}, { repeat: { pattern: '* * * * *' } });
};
