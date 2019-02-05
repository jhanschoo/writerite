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

### Web server -- bot communication

* Messages sent from web server to room bot due to user input
  is latency-critical and not recorded, so they should be via redis.
* Messages sent from bot are typically recorded as part of the
  room conversation: these are not latency-critical and use GQL API
  calls.

## Stack summary

* Language: Typescript
* Server: graphql-yoga, implemented in ExpressJS on NodeJS
* Communication:
  * PubSub: redis
  * Frontend: pushes via GraphQL Subscriptions over WebSockets, usual CRUD via GraphQL Queries and Mutations over HTTP via Apollo Server using the graphql-yoga framework.
* Authentication:
  * Third-party (Google or Facebook) identity verification: hand-rolled authorization flow; server verifies with third-party an access token issued by third-party to the user that is then sent to the server over HTTPS.
  * Authorization managed in hand-rolled solution using JWTs issued using `jsrsasign` to sign digest.
    * TODO: ATM the keys are generated when the server starts up. Implement publication and rotation of keys needed to implement load-balancing.
  * Passwords: hashed by `bcrypt`.
* Persistence:
  * Database: PostGreSQL through the Prisma Client ORM.
    * TODO: figure out deduplication for heavily nested queries.
* Testing: Jest
* Deployment:
  * Containerization: Docker
  * Orchestration: Kubernetes
  * TLS Certificate management for cluster ingress: `cert-manager`.
