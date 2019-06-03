# @writerite/backend-yoga

In development, create a `.env` file with the environment variables described below, to avoid tediously maintaining the environment variables.

1. `npm install`
2. `npx prisma deploy` (note that even with a `.env` file, wou need `PRISMA_ENDPOINT` to be set for this command to run.)
3. `npm run start:dev`

The following environment variables need to be set:

* `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from Google's OpenID Connect
* `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` from Facebook Login
* `RECAPTCHA_SECRET` from ReCAPTCHA
* `PRISMA_ENDPOINT` the uri describing the prisma backend.

The following environment variables may be set:

* `REDIS_HOST`, `REDIS_PORT` of a redis instance; the app uses dbs 1 and 2. Defaults to `127.0.0.1` and `6379` respectively.
* `CERT_FILE`, `KEY_FILE`; if both are present, the app serves as HTTPS and WSS.

## Notes

* TODO: implement authorization-based visibility
* Move key generation to redis

### Web server -- bot communication

* Messages sent from web server to room bot due to user input
  is latency-critical and not recorded, so they should be via redis.
* Messages sent from bot are typically recorded as part of the
  room conversation: these are not latency-critical and use GQL API
  calls.

## Room consistency model

* A room is active when created
* Rooms can be set to inactive by an API
* When a message is posted into a room, assuming no errors,
  if it is not longer than one day since creation or the last known
  posting of a message into the room while it was active, it updates
  the last known posting of a message into the room while it was active
* When more than one day has passed since the creation of a room or
  the last known posting of a message into the room while it was active,
  the room becomes inactive

## Stack summary

* Language: Typescript
* Server: ExpressJS
* Communication:
  * PubSub: redis
  * Frontend: GraphQL with subscriptions using Apollo Server.
* Authentication:
  * Third-party (Google or Facebook) identity verification: hand-rolled authorization flow; server verifies with third-party an access token issued by third-party to the user that is then sent to the server over HTTPS.
  * Authorization managed in hand-rolled solution using JWTs issued using `jsrsasign` to sign digest.
    * TODO: ATM the keys are generated when the server starts up.
  * Passwords: hashed by `bcrypt`.
* Persistence:
  * Database: PostgreSQL through the Prisma Client ORM.
* Testing: Jest
* Deployment:
  * Containerization: Docker
  * Orchestration: Kubernetes
  * TLS Certificate management for cluster ingress: `cert-manager`.
