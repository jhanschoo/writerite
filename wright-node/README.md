# @writerite/wright-node

Worker servicing chat in `@writerite/backend-yoga` as a chatroom bot. Check `kubernetes/core/writerite-wright-node.deployment.yaml` for deployment configuration alongside `kubernetes/core/writerite-backend-yoga.deployment.yaml`.

## Stack summary

* Language: Typescript
* Communication:
  * Low-latency: Redis PubSub
  * Sending to API server: GraphQL using Apollo Client
  * Locks for async execution: async-lock
* Deployment:
  * Containerization: Docker
  * Orchestration: Kubernetes

## Config Communication

* Config messages specify where to place the config message in chat.
  they do not contain anything about the current config state.

## Quiz Round Framework API

* `quizServer(channel: string, rounds: Round[]): Promise<void>` asynchronously serves a quiz consisting of rounds.
  * `channel` is the channel on which to listen for messages.
  * `rounds` is an array of `Round`s that may be mutated by `quizServer`.
  * Each round handler `Round` is a function (thunk) `() => Promise<INextParams>`.
  * `INextParams` is an object with the following properties:
    * `rounds?: Round[]`,
    * `delay?: number | null`,
    * `messageHandler?: MessageHandler`, where
      * Each `MessageHandler` is a function (thunk) `(message: string) => Promise<INextParams>`.

### Behavior

When invoked, `quizServer` invokes the rounds handlers in `rounds` and message handlers with a guarantee that only one invocation among the round handlers and message handlers is active at a time, as long as every round handler and message handler have no deferred execution left in the event loop when they resolve.

Whenever `quizServer` tries to invoke a round handler, it does so by trying to `pop` the last round handler off the `rounds` array. If the `rounds` array is empty at that point, it resolves.

The return object `INextParams` tells `quizServer` how to serve the next round, and what to do until it serves the next round.

* `rounds`, if defined, replaces the current `rounds` array with this one. `quizServer` may mutate this array.
* `delay`, if `undefined`, schedules the next round to run as soon as possible. If `null`, it does not schedule the next round. If an integer, it schedules the next round to run as soon as possible after `delay` milliseconds, but it cannot "push back" a previous scheduling. That is, if it has already been scheduled to run at an earlier future time, the next round will begin as soon as possible after that earlier time; on the other hand, if it has already been scheduled to run at a later future time, the schedule will be brought forward to this earlier future time.
* `messageHandler`, if defined, and if delay is also defined, specifies how to handle messages until the next round begins. If either `messageHandler` or `delay` are left undefined, the old behavior is retained. If messages are received after a new round begins but a new `messageHandler` has not (yet) been defined, messages received will not be handled by an old `messageHandler` but silently dropped.

### Some Guarantees and Limitations

* If a round handler and message handler has any deferred execution left in the event loop when they resolve/reject, the deferred execution is not managed by `quizServer`. Hence the deferred execution should not mutate `rounds`, and how it may asynchronously affect the execution of other round handlers or message handlers should be noted. All round handlers and message handlers should eventually resolve or reject.
* Until an invocation of `quizServer` resolves, every `rounds` passed in the initial invocation and via `INextParams` should not be mutated outside the round handlers and message handlers passed to that invocation. Conversely, it is allowed to mutate `rounds` from within the round handlers and message handlers.
* `quizServer` guarantees that only one invocation among the round handlers and message handlers (passed to that invocation) is active at a time. That is, another round handler or message handler will not be invoked wrt this invocation of `quizServer` while a round handler or message handler is yet to resolve.
* `quizServer` immediately rejects and stops processing queued rounds and messages upon encountering an error.
* `quizServer` guarantees that a message handler for a given round will not be invoked when a future round has already started.
* `quizServer` guarantees in-order for message handling.
* `quizServer` does not guarantee starvation-freedom for rounds under a high load of incoming messages.