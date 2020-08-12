import { createClient } from './redisClient';

export interface INextParams {
  rounds?: Round[];
  delay?: number | null;
  messageHandler?: MessageHandler;
}

export type Round = () => Promise<INextParams>;

export type MessageHandler = (message: string) => Promise<INextParams>;

type WrappedMessageHandler = (message: string) => Promise<void>;

const DO_NOTHING: WrappedMessageHandler = (_message: string) => Promise.resolve();

export const quizServer = (channel: string, rounds: Round[]): Promise<void> => {
  if (rounds.length === 0) {
    return Promise.resolve();
  }
  const client = createClient();
  let roundNum = 0;
  let wrappedMessageHandler = DO_NOTHING;
  return new Promise<void>((res, rej) => {
    const readyListener = () => {
      client.subscribe(channel);
      client.on('message', messageListener);
      queue(thunkRound(0));
    };
    const messageListener = (_channel: string, message: string) => {
      // wrappedMessageHandler is shared, so we retain a reference to
      // the current handler upon invocation, so its identity does
      // not change when it is finally invoked. Ultimately this
      // means that some messages received before the next round
      // begins are dropped rather than handled with the next
      // round's message handler (good), though not all due to race
      // conditions out of our control. Perhaps consider just naively
      // using safeMessageHandler.
      const currentMessageHandler = wrappedMessageHandler;
      queue(() => currentMessageHandler(message));
    };
    const quitHandler = () => {
      // eventually cleanup queue and client on error; client's
      // event handler possesses last reference to queue.;
      client.quit(() => {
        client.off('ready', readyListener);
        client.off('message', messageListener);
      });
    };
    const queue = (() => {
      let _queue = Promise.resolve();
      return (p: () => Promise<void>) => {
        _queue = _queue.then(p).catch((reason: any) => {
          // all queued thunks get dropped when when rejected.
          // eventually cleanup queue and client on fulfilment; client's
          // event handler possesses last reference to queue.
          // When done, queue should be available for GC.
          quitHandler();
          rej(reason);
        });
      };
    })();
    const thunkRound = (tag: number) => {
      const nextTag = tag + 1;
      const queueNextRound = (): void => queue(thunkRound(nextTag));
      const handleNextRoundAndMessageHandler = ({ rounds: newRounds, delay, messageHandler }: INextParams): void => {
        if (newRounds) {
          rounds = newRounds;
        }
        if (delay === undefined) {
          return queueNextRound();
        }
        if (delay !== null) {
          setTimeout(queueNextRound, delay);
        }
        if (messageHandler) {
          wrappedMessageHandler = tagMessageHandler(messageHandler);
        }
      };
      const tagMessageHandler = (messageHandler: MessageHandler) => async (message: string) => {
        // noop if surfaced in queue but next round has come/all rounds
        // have ended
        // nextTag is used since current round has already incremented
        // roundNum
        if (nextTag !== roundNum) {
          return;
        }
        return handleNextRoundAndMessageHandler(await messageHandler(message));
      };
      return async () => {
        // noop if surfaced in queue but next round has come/all rounds
        // have ended
        if (tag !== roundNum) {
          return;
        }
        roundNum = nextTag;
        const round = rounds.pop();
        if (!round) {
          // ignore all queued thunks, by our construction of thunks,
          // with the below setting they fulfil without queueing yet
          // more events.
          roundNum = Infinity;
          // eventually cleanup queue and client on fulfilment; client's
          // event handler possesses last reference to queue.
          quitHandler();
          return res();
          // once returned, queued thunks all get fulfilled and queue
          // becomes available for GC since no more references or work
          // left. Unsure if ioredis leaks memory even when cleaned
          // up as per documentation.
        }
        return handleNextRoundAndMessageHandler(await round());
      };
    };
    client.on('ready', readyListener);
  });
};
