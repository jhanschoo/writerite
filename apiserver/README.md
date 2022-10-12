# @writerite/apiserver

### Local environment variables

In development, create a `.env` file with the environment variables described below, to avoid tediously maintaining the environment variables.

The following environment variables need to be set:

* `GAPI_CLIENT_ID` and `GAPI_CLIENT_SECRET` from Google's OpenID Connect
* `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` from Facebook Login
* `RECAPTCHA_CLIENT_ID` and `RECAPTCHA_SECRET` from ReCAPTCHA for verifying sign-ups verified via ReCAPTCHA
* `DATABASE_URL` set to the URL of an accessible PostgreSQL database
* `REDIS_HOST`, `REDIS_PORT` of an accessible redis instance; the app uses dbs 1 and 2. Defaults to `127.0.0.1` and `6379` respectively.
* `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` JSON strings in JWK format respectively describing an ES256 private and public key pair.
* `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` set to a redis instance

The following environment variables may be set:

* `CERT_FILE`, `KEY_FILE`; if both are present, the app serves as HTTPS and WSS.
* `DEBUG`, c.f. Prisma documentation

The runtime for this project is `node` of the major version given in `.nvmrc`

### Running the server for development

With environment variables configured, e.g. in a `.env`, to run in development, execute:

* `npm i`
* `npm run dev:init`
* `npm run dev`

### Running integration tests

To run the integration tests, set up the environment against a PostgreSQL DB and Redis server, then run

* `npm i`
* `npm run dev:init`
* `npm run test:integration`

### Running unit tests

To run unit tests, run

* `npm i`
* `npm run test:unit`

## Notes

* We do not verify that the email of users who have signed up with a Google or Facebook account have the email that is registered with those services. They are only used to validate that the sign-up was trusted. Similarly, we do not verify any email provided for email/password signups.
* APIs do not guarantee that objects returned are that of a snapshot, only that they are some time after request is made.

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

## Subproject organization

### Stack summary

* Language: Typescript
* Server: ExpressJS
* Communication:
  * Frontend: GraphQL with subscriptions using `urql` and GraphQL Yoga.
* Authentication:
  * Third-party (Google or Facebook) identity verification: hand-rolled OAuth2 flow; server verifies with third-party an access token issued by third-party to the user that is then sent to the server over HTTPS.
  * Sessions managed in hand-rolled solution using JWTs issued using `jose`.
  * Passwords: hashed by `bcrypt`.
* Persistence:
  * Database: PostgreSQL through Prisma Client.
* Testing: Jest
* Deployment:
  * Containerization: Docker
  * Orchestration: Kubernetes
  * TLS Certificate management for cluster ingress: `cert-manager`; see `writerite/lets-encrypt`.

### Folder organization

#### Top-level files

* `.dockerignore` to ignore inessential generated artifacts when building the docker image
* `.env` (`.gitignore`'d) for local environment variables
* `.eslintignore` to ignore linting tool configuration code files
* `.gitignore` to ignore local and sensitive files
* `.nvmrc` to configure the `node` cersion
* `apiserver.code-workspace` to configure VSCode to a productive development environment for this project
* `codegen.yaml` to configure `graphql-codegen`, which generates a JSON for the API schema, and typescript types for GraphQL queries in tests
* `dockerbuild.sh` to manage building, tagging, and pushing docker images generated from this project as part of CI/CD
* `Dockerfile_app` specifies building the image of the long-running server
* `Dockerfile_init` specifies building the image meant to be run before the long-running server runs upon each new deployment, to ensure an appropriate state
* `jest.config.integration.ts` partially configures `jest` for running integration test
* `jest.config.ts` configures `jest` for running unit tests
* `LICENSE` contains a license under which this project may be redistributed
* `package-lock.json` and `package.json` contain metadata about this project meaningful to `npm`
* `README.md` is this file meant to orient the reader
* `schema.prisma` contains the prisma schema specifying the organization of the persistence layer
* `tsconfig.json` configures typescript for building the project
* `tsconfig.lint.json` configures typescript for IDE-integrated linting

#### Top-level configuration

* `.vscode` contains VSCode configuration
* `generated` contains artifacts generated by the `graphql-codegen` essential for developing frontends and tests
* `migrations` contains persistence layer migrations, typically managed by `prisma`
* `patch_node_modules` contains monkey-patches managed with `npx patch-package`
* `test` contain code that is live only during automated testing
  * `test/helpers` contains helper functions like functions to create and expose a special `Context` object during tests, client GraphQL queries and operations, etc.
  * `test/integration` contains integration tests
  * `test/unit` contains unit tests
* `src` contains handwritten code executed during normal operation
  * `index.ts` is the entry point that sets up the generic web application framework
  * `safeEnv.ts` ensures that the envvars are properly set up at point of container execition
  * `types.ts` accumulates assorted custom concepts used in this project that are meaningful beyond the org level (e.g. generic patterns)
  * `utils.ts` accumulates assorted constants, custom functions and programs used in this project that are meaningful beyond the org level (e.g. authorization claims munging)
  * `graphqlServer.ts` configures the GraphQL middleware
  * `context.ts` configures the context that is exposed to handlers of GraphQL requests
  * `schema.ts` organizes the handlers into a GraphQL API using `nexus`
  * `error` contains factories for various errors meaningful at the app level
  * `graphql` contains handler definitions. Code here manages access control, query complexity control, basic validation, basic transformation, and basic retrieval of business objects, and delegation to services for more complicated retrieval and transformation
  * `service` contains specialized and intermediate-advanced transformation and retrieval, organized by specialization.

#### `package.json` scripts

* `build` transpiles typescript into js code ready for production
* `init:run` is the command executed by the job image in production every deployment of this service to ensure that the persistence layer is appropriately configured
* `app:start` is the command executed by the long-running server image in production
* `dev` is run during development to set up monitoring source files for changes, and a development server to generate appropriate type definitions for handlers using `nexus`.
* `dev:init` is run during development to reconfigure `prisma` and `nexus` for this project.
* `test:integration` executes integration tests serially
* `test:unit` executes unit tests in parallel