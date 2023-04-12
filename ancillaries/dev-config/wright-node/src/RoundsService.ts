/*
 * Consumers may define a message handler to specify how they handle
 * new messages.
 */
export type MessageHandler<T> = (message: T) => Promise<RoundDefinition<T>>;

export interface RoundDefinition<T> {
  /*
   * This property, if defined, ensures that the next round handler
   * would be queued to be evaulated no more than delay ms later. If
   * undefined, it is queued immediately. If delay is null,
   * we do not queue it. Note that the next round handler might be
   * queued to evaluate sooner than the delay we specify, if other
   * roundDefinitions provided or to be provided to the server by
   * handlers this round specify a delay so that it would be queued
   * earlier than this.
   */
  delay?: number | null;
  /*
   * This property, if defined, replaces the current round handlers for
   * future rounds with the round handlers specified
   */
  roundHandlers?: RoundHandler<T>[];
  /*
   * If defined, replaces the current messageHandler for the
   * present round with it.
   */
  messageHandler?: MessageHandler<T>;
}

/*
 * A round handler resolves with a round definition.
 */
export type RoundHandler<T> = () => Promise<RoundDefinition<T>>;

/*
 * Internally, message handlers are chained to modify the round state
 * and invoke the next rounds when they end.
 */
type SendHandler<T> = (message: T) => Promise<void>;

/*
 * A PromiseThunk value is a function that when evaluated
 * does some light computation, then returns a promise
 * that resolves after some deferred heavy computation.
 * We use PromiseThunks to package the evaluation of an
 * TaggedMessageHandler on a particular message so that it
 * can be queued.
 */
type PromiseThunk = () => Promise<void>;

export class RoundsService<T> {
  // state
  #roundHandlers: RoundHandler<T>[];

  #round = 0;

  #rawQueue = Promise.resolve();

  readonly #promise: Promise<void>;

  // private methods

  // #queue queues a promise thunk.
  readonly #queue: (t: PromiseThunk) => void;

  /*
   * #thunkRound constructs a thunk that when evaluated, starts the
   * round-th round (if the round-th round has yet started). Note that
   * starting the round-th round also involves scheduling, then
   * #queue'ing, or directly #queue'ing the thunk for the
   * (round+1)-th round.
   *
   * Thus once evaulated (if the round-th round has yet started), rounds
   * will continue to be thunked, scheduled, #queue'd, started based
   * on the state of the roundsServer until a termination condition.
   */
  readonly #roundThunker: (round: number) => PromiseThunk;

  /*
   * #messageThunker is similar to #thunkRound, but for handling
   * messages. It is updated whenever a round definition updates
   * the messageHandler to use the new message handler.
   *
   * Thus once evaluated on a particular message sent during a
   * particular round, it will first execute the messageHandler
   * specified by the round definition obtained from the evaulation
   * of current or previous round thunks or message thunks, then
   * update the state based on the round definition obtained from the
   * specified messageHandler.
   *
   * Note that if a round thunk (for a next round, not a redundant one)
   * is queued when a message is received, that message will be ignored
   * via the following mechanism: the send() API remembers the
   * #messageThunker at time when the message is received, which when
   * evaluated performs a no-op instead of calling the messageHandler
   * etc. if #round is not the one corresponding to the round for which
   * #messageThunker was defined to handle. But the queued round thunk
   * would be evaluated first and update #round into one that the
   * remembered #messageThunker was not defined to handle.
   */
  #messageThunker: SendHandler<T>;

  /*
   * field to hold the res handler, called when all rounds are done.
   */
  #res: () => void;

  /*
   * field to hold the rej handler, called when any thunk fails.
   */
  #rej: (reason?: unknown) => void;

  // Public API

  constructor(roundHandlers: RoundHandler<T>[]) {
    /*
     * dummy values to satisfy ts compiler that will be overwritten
     * before constructor is done
     */
    this.#rej = this.#res = () => undefined;
    this.#messageThunker = () => Promise.resolve();

    // actual initialization
    this.#roundHandlers = roundHandlers;
    this.#queue = (t: PromiseThunk) => {
      this.#rawQueue = this.#rawQueue.then(t).catch(this.#rej);
    };
    this.#roundThunker = (round: number) => {
      const nextRound = round + 1;
      const queueNextRound = () => this.#queue(this.#roundThunker(nextRound));
      const updateState = ({
        roundHandlers: newRounds,
        delay,
        messageHandler,
      }: RoundDefinition<T>) => {
        if (newRounds) {
          this.#roundHandlers = newRounds;
        }
        /*
         * replace the message handler with the provided one
         */
        if (messageHandler) {
          this.#messageThunker = async (message: T) => {
            /*
             * On the nth round, thunkRound has consumed the nth
             * round definition and incremented this.roundNum to n+1 by
             * the time message handlers for the nth round are
             * evaluated. Hence to check that they are executed only on
             * messages that have arrived in the correct round, we
             * compare this.roundNum against nextRound = n+1, and not on
             * round = n itself.
             */
            if (nextRound !== this.#round) {
              return;
            }
            updateState(await messageHandler(message));
          };
        }
        /*
         * evaluate this.thunkRound(nextTag) as soon as possible.
         */
        if (delay === undefined) {
          return queueNextRound();
        }
        /*
         * evaluate this.thunkRound(nextTag) after delay ms.
         */
        if (delay !== null) {
          setTimeout(queueNextRound, delay);
        }
        /*
         * if delay === null, then the next round is not scheduled
         * or queued. If there is no next round already scheduled
         * or queued, we keep waiting for a message to call the
         * currently set message handler which may resolve into a
         * round definition that schedules or queues the next round.
         */
      };
      return async () => {
        if (round !== this.#round) {
          return;
        }
        this.#round = nextRound;
        const roundHandler = this.#roundHandlers.pop();
        if (!roundHandler) {
          // guard against all rounds scheduled to be queued
          this.#round = Infinity;
          return this.#res();
        }
        return updateState(await roundHandler());
      };
    };
    this.#promise = new Promise((res, rej) => {
      this.#res = res;
      this.#rej = rej;
    });
    this.#queue(this.#roundThunker(0));
  }

  /*
   * done is a promise that resolves when all rounds are done,
   * and rejects if any errors occur.
   */
  get done(): Promise<void> {
    return this.#promise;
  }

  /*
   * send(message) queues for the currently set message handler
   * to be evaluated on the current message.
   */
  send(message: T): void {
    const currentMessageThunker = this.#messageThunker;
    const messageThunk = () => currentMessageThunker(message);
    this.#queue(messageThunk);
  }
}
