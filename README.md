# WriteRite Monorepo

* `backend-apollo` contains the backend API server project.
* `client-models` contain GQL fragment queries mostly of a certain
  standard form, shared among projects that consume the backend API.
* `dev-config` contains scripts and configuration used in the dev
  environment.
* `frontend-react` contains the frontend project.
* `kubernetes` contains scripts and configuration used to deploy
  a kubernetes cluster running the WriteRite backend primarily using
  `kubectl apply -f`.
* `charts` and `templates` are formatted so that the repository is a
  Helm Chart.
* `wright-node` is a backend service that manages/hosts WriteRite rooms.

## Note for Development

* When publishing a new version, make sure to also update the version
  in the following places:
  * The chart
  * `kubernetes/` files, if exist
  * `backend-apollo`, `frontend-react`, `wright-node`,
  * The `docker-compose.yaml` file in `dev-config/`.
