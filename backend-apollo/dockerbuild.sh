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
  SUFFIX="-dev6"
fi
if [ "$SUFFIX" = "-production" ]
then
  SUFFIX=""
fi
if [ -z "$IMAGE_NAME" ]
then
  IMAGE_NAME="$CI_REGISTRY_IMAGE/backend-apollo"
fi

TAGGED_IMAGE_NAME="$IMAGE_NAME:$PACKAGE_VERSION$SUFFIX"
docker build -t "$TAGGED_IMAGE_NAME" --build-arg node_env="production" --build-arg graph_variant="$CI_COMMIT_REF_SLUG" .
docker push "$TAGGED_IMAGE_NAME"
