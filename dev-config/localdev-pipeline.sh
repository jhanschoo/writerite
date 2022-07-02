#!/usr/bin/env zsh
# this script should be located at $PROJECT_ROOT/dev-config/localdev-pipeline.sh
set -ex

if [[ -f "./.env" ]]
then
	source .env
fi

if [[ -z "$CI_REGISTRY_USER" || -z "$CI_REGISTRY_PASSWORD" || -z "$CI_REGISTRY" || -z "$CI_REGISTRY_IMAGE" ]]
then
	exit 1
fi
export CI_REGISTRY_USER CI_REGISTRY_PASSWORD CI_REGISTRY CI_REGISTRY_IMAGE

export WRITERITE_PROJECT_ROOT="${0:a:h:h}"
export HELM_EXPERIMENTAL_OCI=1
docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY"
helm registry login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY" 

# kubectl context management
kubectl config use-context kind-kind

# secret management
kubectl delete secret gitlab-writerite-writerite-jhanschoo || true
kubectl create secret docker-registry gitlab-writerite-writerite-jhanschoo --docker-server="$CI_REGISTRY" --docker-username="$CI_REGISTRY_USER" --docker-password="$CI_REGISTRY_PASSWORD"

# build-apiserver
cd "$WRITERITE_PROJECT_ROOT/apiserver"
npm i

# build-apiserver
sh dockerbuild.sh

# build-apiserver-chart
cd "$WRITERITE_PROJECT_ROOT/charts/writerite-apiserver"
helm package .
helm push *.tgz "oci://$CI_REGISTRY_IMAGE"
rm *.tgz

# build-backend-chart
cd "$WRITERITE_PROJECT_ROOT/charts/writerite-backend"
helm repo update
helm dependency update
helm package .
helm push *.tgz "oci://$CI_REGISTRY_IMAGE" | tee stdout
WRITERITE_BACKEND_CHART_REF="$(head -1 stdout | sed 's/Pushed:\s*\(.*\)/\1/')"
WRITERITE_BACKEND_CHART_NAME="$CI_REGISTRY_IMAGE/writerite-backend"
WRITERITE_BACKEND_CHART_VERSION="${WRITERITE_BACKEND_CHART_REF#${WRITERITE_BACKEND_CHART_NAME}:}"
rm *.tgz stdout charts/*.tgz

# deploy
cd "$WRITERITE_PROJECT_ROOT/dev-config"
helm uninstall writerite-backend || true
helm install -f .envlocalvalues.yaml --version "$WRITERITE_BACKEND_CHART_VERSION" writerite-backend "oci://$WRITERITE_BACKEND_CHART_NAME"
