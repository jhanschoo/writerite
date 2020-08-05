#!/usr/bin/env sh

# Run in writerite/backend-apollo/

set -ex

NODE_ENV="development"
if [ -n "$1" ]
then
  NODE_ENV="$1"
fi
export NODE_ENV

PACKAGE_VERSION=$(node -pe "require('./package.json').version")
SUFFIX="-$NODE_ENV"
if [ "$SUFFIX" = "-development" ]
then
  SUFFIX="-dev7"
fi
if [ "$SUFFIX" = "-production" ]
then
  SUFFIX=""
fi
if [ -z "$IMAGE_NAME" ]
then
  IMAGE_NAME="$CI_REGISTRY_IMAGE/backend-apollo"
fi

IMAGE_TAG="$IMAGE_NAME:$PACKAGE_VERSION$SUFFIX"
CACHE_IMAGE_TAG="$IMAGE_NAME:latest-$CI_COMMIT_REF_SLUG"

docker pull "$CACHE_IMAGE_TAG" || true
docker build \
  --cache-from "$CACHE_IMAGE_TAG" \
  --build-arg node_env="production" \
  --build-arg graph_variant="$CI_COMMIT_REF_SLUG" \
  --tag "$IMAGE_TAG" \
  --tag "$CACHE_IMAGE_TAG" \
  .

docker push "$IMAGE_TAG"
docker push "$CACHE_IMAGE_TAG"
