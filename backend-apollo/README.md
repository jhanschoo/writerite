# @writerite/backend-apollo

In development, create a `.env` file with the environment variables described below, to avoid tediously maintaining the environment variables.

The following environment variables need to be set:

* `GAPI_CLIENT_ID` and `GAPI_CLIENT_SECRET` from Google's OpenID Connect
* `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` from Facebook Login
* `RECAPTCHA_SECRET` from ReCAPTCHA
* `DATABASE_URL` set to the URL of a PostgreSQL database
* `REDIS_HOST`, `REDIS_PORT` of a redis instance; the app uses dbs 1 and 2. Defaults to `127.0.0.1` and `6379` respectively.
* `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` JSON strings in JWK format respectively describing an ES256 private and public key pair.
* `APOLLO_KEY` an API key to a project registered in Apollo studio

The following environment variables may be set:

* `CERT_FILE`, `KEY_FILE`; if both are present, the app serves as HTTPS and WSS.

To run in development, execute:

* `npm i`
* `npm run build`
* `NODE_ENV="development" npm run start`

## Notes

* TODO: implement authorization-based visibility
* Move key generation to redis

## Models

Four sets of models are specified.

* The prisma schema abstracts the database schema.
* The `SS` inferfaces specified in `models/` are subtypes of their respective types (projected to only scalar fields) specified in the prisma schema. They specify additional optional fields so that
* The schema served by this app is a supertype of their respective `SS` interfaces. Finally,
* The implicit model defined by the resolvers form a subtype of the `SS` interfaces, so that they are also a subtype of the schema.

Hence once the `SS` interfaces are correct subtypes of the prisma schema, and the resolvers' implicit model (loosely speaking) returns `SS` types, an API that satisfies the app's schema is correctly served. Note that this doesn't mean that the API correctly serves the right objects, or that an object is served when expected where the field is optional. In addition, no such guarantees are given for input fields.

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
