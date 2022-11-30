#!/usr/bin/env zsh
# this script should be located at $PROJECT_ROOT/dev-config/kind/setup-kind.sh
# it should be executed from $PROJECT_ROOT/dev-config/kind/
# see: https://kind.sigs.k8s.io/docs/user/ingress/
set -ex

# create kind cluster configured to mirror ports 80 and 443 in container's node to host's 8000 and 8443 respectively
kind create cluster --config kindconfig.yaml
# ensure that kubectl is configured to use kind-kind, else error out
kubectl cluster-info --context kind-kind
# install ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
