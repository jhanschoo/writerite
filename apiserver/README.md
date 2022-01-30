# @writerite/apiserver

In development, create a `.env` file with the environment variables described below, to avoid tediously maintaining the environment variables.

The following environment variables need to be set:

* `GAPI_CLIENT_ID` and `GAPI_CLIENT_SECRET` from Google's OpenID Connect
* `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` from Facebook Login
* `RECAPTCHA_SECRET` from ReCAPTCHA for verifying sign-ups verified via ReCAPTCHA
* `DATABASE_URL` set to the URL of an accessible PostgreSQL database
* `REDIS_HOST`, `REDIS_PORT` of an accessible redis instance; the app uses dbs 1 and 2. Defaults to `127.0.0.1` and `6379` respectively.
* `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` JSON strings in JWK format respectively describing an ES256 private and public key pair.

The following environment variables may be set:

* `CERT_FILE`, `KEY_FILE`; if both are present, the app serves as HTTPS and WSS.

With environment variables configured, e.g. in a `.env`, to run in development, execute:

* `npm i`
* `npm run dev`

To run the integration test, set up the environment against a PostgreSQL DB and Redis server, then after having run `npm run dev`, run

* `npm run test`

We don't presently have unit tests.

## Notes

* We do not verify that the email of users who have signed up with a Google or Facebook account have the email that is registered with those services. They are only used to validate that the sign-up was trusted. Similarly, we do not verify any email provided for email/password signups.
* APIs do not guarantee that objects returned are that of a snapshot, only that they are some time after request is made.

### Web server -- bot communication

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
  * Frontend & bots: GraphQL with subscriptions using `urql` and GraphQL Yoga.
* Authentication:
  * Third-party (Google or Facebook) identity verification: hand-rolled OAuth2 flow; server verifies with third-party an access token issued by third-party to the user that is then sent to the server over HTTPS.
  * Authorization managed in hand-rolled solution (as opposed to Passport.js, etc.) using JWTs issued using `jsrsasign` to sign digest.
  * Passwords: hashed by `bcrypt`.
* Persistence:
  * Database: PostgreSQL through Prisma Client.
* Testing: Jest
* Deployment:
  * Containerization: Docker
  * Orchestration: Kubernetes
  * TLS Certificate management for cluster ingress: `cert-manager`; see `writerite/lets-encrypt`.
