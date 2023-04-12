# Room

This note details the architecture of the room domain objects, and how they support the flows they need to support.

## General description and responsibility

The room object:

- Is responsible for allowing / denying users joining the room
- Is responsible for publication of messages, and restricting publication of messages from users and quizconductors
- Is responsible for creating / terminating

## Subtypes, States and Behaviors

- HostedPerpetual
  - To each deck, there are 0 or 1 hosted perpetual rooms; each room is associated with a particular deck.
  - The HostedPerpetual room is always associated with a single quizconductor (that quizconductor may be dormant if nobody is actively using the room).
  - Only the deck owner is able to send control commands to the quizconductor of the room.
  - Anybody can join or leave a HostedPerpetual room at any time.
  - Any occupant can invite their friends to a HostedPerpetual room thry at any time. The invited friend sent a notification to be immediately informed of their membership in the room, and through which they can join the room.
  - The quizconductor can tell the room to kick any occupant (but for the owner) at any time, and the room will do it. This is to handle people leaving the room silently.
  - It is not possible to request that the quizconductor be terminated.
- GroupPerpetual
  - Each such room has at least one occupant.
  - At any time, any occupant can invite any friend to a GroupPerpetual room. The invited friend is immediately an occupant of the room. The invited friend is also sent a notification to be immediately informed of their membership in the room, and through which they can join the room.
  - At any time, anyone can join a GroupPerpetual room containing a friend. (Hence nothing is really secret, and a bad friend can open up all your group chats to abuse.)
  - Any occupant can send control commands to the quizconductor of the room, if it exists.
  - Any occupant can choose to leave at any time.
  - Any user can request a GroupPerpetual room together with any other friends of the user at any time, and a message must be simultaneously sent with such a request.
    - If no room exists with these occupants, a new GroupPerpetual room is created.
    - If rooms exist with these occupants, the most recent one is returned.
    - Thus note that whereas to each subset of users there may exist multiple GroupPerpetual rooms, in most cases most GroupPerpetual rooms have only connected users (i.e. on the friendship graph there is a path from any one occupant to any other), and to each such subset there is only one GroupPerpetual room that they are actively/regularly using to communicate in that subset.
  - The room is associated with zero or one quizconductor.
  - When the room is associated with zero quizconductors, it supports publication of informative messages for clients to inform each other of what kind of quiz they would like to serve.
  - Any occupant can transition a room with zero quizconductors to a room with one quizconductor by calling an endpoint with an appropriate payload (it is checked that creating a quizconductor as specified by the payload is legal).
  - The room will not honor requests from the quizconductor to kick occupants.
  - It is possible to request that the quizconductor be terminated.
  - It is possible to request the creation of an GroupEvanescent room with the same occupants as the current occupants of the current room with an appropriate payload. This must be a special function of a GroupPerpetual room and cannot be handled by independent creation of a GroupEvanescent room, since there must be a message indicating the creation of the GroupEvanescent room in the GroupPerpetual room, and which must also signal to frontend clients to replace the current room with the GroupEvanescent room. It is possible for the informative messages to be used to plan the kind of quiz the GroupEvanescent room should serve.
- GroupEvanescent
  - There are only two ways to create a GroupEvanescent room.
    - One way is via the solo evanescent room from deck detail flow.
    - The other way is from a GroupPerpetual room. When this happens, the parent GroupPerpetual room is remembered, but this information is hidden from clients.
  - It is NOT possible to leave a GroupEvanescent room. As such, all GroupEvanescent rooms should have at least one occupant.
  - The GroupEvanescent room is always associated with a single quizconductor.
  - In order to support the solo testing usecase, one may join a GroupEvanescent room by being invited by an occupant, but it is not possible to independently join a GroupEvanescent room.
  - Any occupant can send control commands to the quizconductor of the room.
  - The quizconductor is expected to have a finite lifespan, eventually terminating.
  - When the quizconductor self-terminates, the GroupEvanescent room is terminated, resulting in the following frontend client behaviors
    - If there is a parent GroupPerpetual room, and there was no addition in occupants in the GroupEvanescent room, all occupants are returned to that parent GroupPerpetual room.
    - Otherwise, if this not a solo room, an appropriate GroupPerpetual room is requested (retrieved / created) that contains all the current occupants exactly. A message is sent to the GroupPerpetual room indicating the reason.
    - If this is a solo room, the occupant is returned to the deck that it was serving.

## Flows to consider

- Create room with external friends
- Join friends' room from dashboard.
- Solo perpetual room from dashboard.
- Solo evanescent room from deck detail.

## Consistency guarantees under improper termination

- On service down, clients will keep trying to resubscribe.
- Clients do not maintain more than X displayable messages in history, hence clients' views are eventually consistent upon view change or enough new displayable messages being sent. (non-displayable messages don't affect view state).
- For Perpetual rooms, it is on room subscription that the room determines if it should spin up a quizconductor (in a distributed-safe fashion). Quizconductors regularly send a heartbeat to the singleton DB, and this log gives the quizconductor an ephemeral lock.
- For Evanescent rooms, quizconductors will not be recreated.
  - Thus there may exist Evanescent rooms that do no get to run the full quiz the quizmaster intended to run, and that may not have a return message near its end.
- Each instance on a very long timeout cleans up old quizconductor heartbeats and closes rooms without quizconductors.
