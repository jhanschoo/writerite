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

## Kubernetes configuration

Create a secrets file with the OAuth app permissions and put it in the `kubernetes/` directory. For example,

```
apiVersion: v1
kind: Secret
metadata:
  name: writerite-oauth2-app-credentials-production
type: Opaque
data:
  googleClientID: <your Google client ID, base64 encoded>
  googleClientSecret: <your Google client secret, base64 encoded>
  facebookAppID: <your Facebook app ID, base64 encoded>
  facebookAppSecret: <your Facebook app secret, base64 encoded>
  recaptchaSecret: <your ReCAPTCHA secret, base64 encoded>
```

Also rewrite the relevant fields on `writerite.ingress.yaml` if not deploying to `ritewrite.site`.

Make sure that `helm` is installed on your computer. Then, with `kubectl` pointing to a new cluster,

1. `kubectl apply -f kubernetes/` to read all json and yaml files in this directory to configure the cluster. Note that ClusterIssuer resourses will fail to create since they have not been defined. This will define resources for the following and wire them
  * `redis`, `postgres`, `prisma`, `writerite-backend-yoga` deployments and services, with a persistent volume claim to the `postgres` container. The `writerite-backend-yoga` service uses `NodePort` for compatibility with GKE ingress.
  * `tiller` service account, and grants it the `cluster-admin` cluster role. Note that this gives `tiller` broad permissions over the entire cluster.
  * `writerite` ingress for the cluster. While deprecated behavior, we currently rely on the ingress continuing to serve the http rules even when the `tls` part cannot be satisfactorily provided, in order to use the `http-01` ACME challenge. We shall no longer need this if we migrate to the `dns-01` challenge.
  * The secrets resource we previously defined.
2. `sh kubernetes/helmImperativeConfig.sh`.
  * This script installs `tiller` and allows it to use the aforementioned `tiller` service account.
  * It then uses tiller to set up `cert-manager`. `cert-manager` then creates resource definitions for automated certificate management.
3. `kubectl apply -f kubernetes/`. This creates the resources previously not created.
4. Get the external IP of your Ingress, and set up DNS to point your hostname to it.
5. Wait for the ingress's controller (i.e. that which satisfies an ingress request) to update, after which the app should be exposed on https.

The spec files in `kubernetes-debug/` describe `LoadBalancer` services that expose the respective pods externally as an externally exposed service. You may create these services for debugging, or to achieve a similar objective my may use `kubectl port-forward`.

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