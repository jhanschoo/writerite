import { fork, ChildProcess } from 'child_process';

import { lock, getRoomInfo, sendMessageFactory } from './util';
import { createRedis } from './createRedis';

interface IProcessRegistry {
  [roomId: string]: ChildProcess;
}

const procRegistry: IProcessRegistry = {};
const PROC_REGISTRY = 'procRegistry';

const redisClient = createRedis();
redisClient.subscribe('writerite:room:serving');

redisClient.on('message', (_channel: string, message: string) => {
  const separator = message.indexOf(':');
  const roomId = message.slice(0, separator);
  const deckId = message.slice(separator + 1);
  lock.acquire(PROC_REGISTRY, (forkingDone) => {
    if (procRegistry[roomId]) {
      const oldFork = procRegistry[roomId];
      // possible synchronization lag in that a process may terminate
      // and release the PID, but cleanup hasn't deregistered the handle
      // before this is executed. Nevertheless, it is very unlikely
      // that the PID has been reassigned since, so this should be fine
      // without a more complex synchronization mechanism.
      oldFork.kill();
      delete procRegistry[roomId];
      // tslint:disable-next-line: no-console
      console.log('killing old process');
    }
    // tslint:disable-next-line: no-console
    console.log('starting new acolyte');
    const forked = fork('./dist/serveRoom.js', [roomId, deckId]);
    // the below deregisters the exited process so that
    // old process handles' kill() are not used to kill potentially
    // different processes with a reused PID
    forked.on('exit', () => lock.acquire(PROC_REGISTRY, (cleanupDone) => {
      // tslint:disable-next-line: no-console
      console.log('process exited');
      if (procRegistry[roomId] === forked) {
        delete procRegistry[roomId];
      }
      cleanupDone();
    }));
    procRegistry[roomId] = forked;
    forkingDone();

    // setup communication
    (async () => {
      const sendMessage = sendMessageFactory(roomId);
      sendMessage('Indoctrinating acolyte...');
      forked.send({
        operation: 'getRoomInfo',
        payload: await getRoomInfo(roomId),
      });
      forked.on('message', (m) => {
        sendMessage(m);
      });
    })();
  });
});
