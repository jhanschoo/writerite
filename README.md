# WriteRite Monorepo

* `backend-apollo` contains the backend API server project.
* `frontend-react` contains the frontend project.
* `wright-node` is a backend service that manages/hosts WriteRite rooms.
* `client-models` contain GQL fragment queries mostly of a certain
  standard form, shared among projects that consume the backend API.
* `dev-config` contains scripts and configuration used in the dev
  environment, and to set it up.
* `charts` contain the `writerite-backend-apollo` chart used to deploy
  `backend-apollo`, the `writerite-wright-node` chart used to deploy
  `wright-node`, and the `writerite-backend` chart used to deploy
  the above altogether.

Check `.gitlab-ci.yml` for an idea of how the project is deployed.