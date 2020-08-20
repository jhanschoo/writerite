# @writerite/wright-node

Worker servicing chat in `@writerite/backend-apollo` as a chatroom bot.

## Stack summary

* Language: Typescript
* Communication:
  * GraphQL using Apollo Client
* Deployment:
  * Containerization: Docker
  * Orchestration: Kubernetes

## RoundsService

* `new RoundsService<T>(roundHandlers: RoundHandler<T>[]): Promise<void>` asynchronously serves a quiz consisting of rounds.
  * `roundHandlers` is an array of `RoundHandler`s that may be mutated.
  * Each round handler `RoundHandler` is a function (thunk) `() => Promise<RoundDefinition<T>>`.
  * `RoundDefinition<T>` is an object with the following properties:
    * `delay?: number | null`,
    * `oundHandlers?: RoundHandler[]`,
    * `messageHandler?: MessageHandler<T>`, where
      * A `MessageHandler<T>` is a function (thunk) `(message: T) => Promise<RoundDefinition<T>>`.

### Behavior

When constructed, `roundsService` eventually invokes the round handlers in `roundHandlers` and message handlers with a guarantee that only one invocation among the round handlers and message handlers is active at a time, as long as every round handler and message handler have no deferred execution left when they resolve.

Whenever `roundsService` tries to invoke a round handler, it does so by `pop`ping the last round handler off the last specified `roundHandlers` array. If the `roundHandlers` array is empty at that point, `roundsService.done` resolves.

The resolve object `RoundDefinition<T>` allows us to dynamically change how `quizServer` serves the next round, and how messages are processed until the next round.

* `rounds`, if defined, replaces the current `rounds` array with this one. `quizServer` may mutate this array.
* `delay`, if `undefined`, schedules the next round to run as soon as possible. If `null`, it does not schedule the next round. If an integer, it schedules the next round to run as soon as possible after `delay` milliseconds, but it cannot "push back" a previous scheduling. That is, if the next round has already been scheduled to run at an earlier future time, it will run as soon as possible after that earlier time; on the other hand, if it has already been scheduled to run as soon as possible after a later future time, the schedule will be brought forward to this earlier future time. If no next rounds are scheduled to run, the current round continues until a messageHandler evaluated on a message resolves into a round definition that schedules the next round.
* `messageHandler`, if defined, specifies how to handle messages until the next round begins. If messages are received after a new round is queued to begin has not yet begun, messages received will not be handled by the current `messageHandler` or the next round's `messageHandler` but silently dropped.

### Some Guarantees and Limitations

* If a round handler and message handler has any deferred execution left in the event loop when they resolve/reject, the deferred execution is not managed by `roundsServer`. Hence the deferred execution should not mutate `roundHandlers`, and how it may asynchronously affect the execution of other round handlers or message handlers should be noted. All round handlers and message handlers should eventually resolve or reject.
* Until `roundsServer.done` resolves, every `roundHandlers` passed in the initial invocation and via `RoundDefinition` should not be mutated outside the round handlers and message handlers passed to that invocation. Conversely, it is allowed to mutate `roundHandlers` from within the round handlers and message handlers. If this is desired, you are advised retain a reference to these `roundHandlers` arrays.
* `roundsServer` guarantees that only one invocation among the round handlers and message handlers (passed to that invocation) is active at a time, as long as they have no deferred invocation when they resolve. That is, another round handler or message handler will not be invoked wrt this invocation of `roundsServer` while a round handler or message handler is yet to resolve.
* `roundsServer` immediately rejects and stops processing queued rounds and messages upon encountering an error.
* `roundsServer` guarantees that a message handler for a given round will not be invoked when a future round has already started.
* `roundsServer` guarantees in-order for message handling.
* `roundsServer` does not guarantee starvation-freedom for scheduled rounds if consumer-defined code may prevent the microtask queue from being empty during next ticks.
