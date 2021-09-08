#!/usr/bin/env zsh
# this script should be located at $PROJECT_ROOT/dev-config/deploy-to-kind.sh
set -ex

if [[ -z "$CI_REGISTRY_USER" || -z "$CI_REGISTRY_PASSWORD" || -z "$CI_REGISTRY" || -z "$CI_REGISTRY_IMAGE" ]]
then
	exit 1
fi

export WRITERITE_PROJECT_ROOT="${0:a:h:h}"
export HELM_EXPERIMENTAL_OCI=1
docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY"
helm registry login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY" 

# secret management
kubectl delete secret gitlab-writerite-writerite-jhanschoo || true
kubectl create secret docker-registry gitlab-writerite-writerite-jhanschoo --docker-server="$CI_REGISTRY" --docker-username="$CI_REGISTRY_USER" --docker-password="$CI_REGISTRY_PASSWORD"

# build-backend-apollo
cd "$WRITERITE_PROJECT_ROOT/backend-apollo"
npm i

# build-backend-apollo
sh dockerbuild.sh

# build-backend-apollo-chart
cd "$WRITERITE_PROJECT_ROOT/charts/writerite-backend-apollo"
helm chart save . "$CI_REGISTRY_IMAGE/writerite-backend-apollo" | tee stdout
helm chart push "$(head -1 stdout | sed 's/ref:\s*\(.*\)/\1/')"
rm stdout

# build-backend-chart
cd "$WRITERITE_PROJECT_ROOT/charts/writerite-backend"
helm repo update
helm dependency update
helm chart save . "$CI_REGISTRY_IMAGE/writerite-backend" | tee stdout
WRITERITE_BACKEND_CHART_REF="$(head -1 stdout | sed 's/ref:\s*\(.*\)/\1/')"
helm chart push "$WRITERITE_BACKEND_CHART_REF"
rm stdout charts/*.tgz

# deploy
cd "$WRITERITE_PROJECT_ROOT/dev-config"
helm uninstall writerite-backend || true
helm install -f .envlocalvalues.yaml writerite-backend "oci://$WRITERITE_BACKEND_CHART_REF"
