#!/usr/bin/env bash

set -ex

export RELEASE_NAME=${HELM_RELEASE_NAME:-$CI_ENVIRONMENT_SLUG}
auto_database_url=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${RELEASE_NAME}-postgres:5432/${POSTGRES_DB}
export DATABASE_URL=${DATABASE_URL-$auto_database_url}
export TILLER_NAMESPACE=$KUBE_NAMESPACE
export HELM_HOST="localhost:44134"

echo $RELEASE_NAME
echo $auto_database_url

# check_kube_domain
echo "$KUBE_INGRESS_BASE_DOMAIN"
test -n "$KUBE_INGRESS_BASE_DOMAIN"
# download_chart
helm init --client-only
helm repo add ${AUTO_DEVOPS_CHART_REPOSITORY_NAME:-gitlab} ${AUTO_DEVOPS_CHART_REPOSITORY:-https://charts.gitlab.io} ${AUTO_DEVOPS_CHART_REPOSITORY_USERNAME:+"--username" "$AUTO_DEVOPS_CHART_REPOSITORY_USERNAME"} ${AUTO_DEVOPS_CHART_REPOSITORY_PASSWORD:+"--password" "$AUTO_DEVOPS_CHART_REPOSITORY_PASSWORD"}
helm dependency update charts/ritewrite/
helm dependency build charts/ritewrite/
# ensure_namespace
kubectl get namespace "$KUBE_NAMESPACE"
# initialize_tiller
nohup tiller -listen ${HELM_HOST} -alsologtostderr >/dev/null 2>&1 &
echo "Tiller is listening on ${HELM_HOST}"
helm version --debug
# deploy
name="$RELEASE_NAME"

helm install --dry-run --debug charts/ritewrite