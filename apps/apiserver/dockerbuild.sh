#!/usr/bin/env sh

# Run in writerite/apiserver/

set -ex

export DOCKER_BUILDKIT=1 
NODE_ENV="development"
if [ -n "$1" ]
then
  NODE_ENV="$1"
fi
export NODE_ENV

if [ -z "$CI_JOB_ID" ]
then
  CI_COMMIT_REF_SLUG="localdev"
fi

PACKAGE_VERSION=$(node -pe "require('./package.json').version")
SUFFIX="-$NODE_ENV"
if [ "$SUFFIX" = "-development" ]
then
  SUFFIX="-dev.12"
fi
if [ "$SUFFIX" = "-production" ]
then
  SUFFIX=""
fi
if [ -z "$INITJOB_IMAGE_NAME" ]
then
  INITJOB_IMAGE_NAME="$CI_REGISTRY_IMAGE/apiserver-initjob"
fi
if [ -z "$APP_IMAGE_NAME" ]
then
  APP_IMAGE_NAME="$CI_REGISTRY_IMAGE/apiserver-app"
fi

# build init image
INITJOB_IMAGE_TAG="$INITJOB_IMAGE_NAME:$PACKAGE_VERSION$SUFFIX"
INITJOB_CACHE_IMAGE_TAG="$INITJOB_IMAGE_NAME:latest-$CI_COMMIT_REF_SLUG"

docker pull "$INITJOB_CACHE_IMAGE_TAG" || true
cp Dockerfile_init Dockerfile
docker build \
  --cache-from "$INITJOB_CACHE_IMAGE_TAG" \
  --tag "$INITJOB_IMAGE_TAG" \
  --tag "$INITJOB_CACHE_IMAGE_TAG" \
  .
kind load docker-image "$INITJOB_IMAGE_TAG" || true

docker push "$INITJOB_IMAGE_TAG"
docker push "$INITJOB_CACHE_IMAGE_TAG"

# build app image
APP_IMAGE_TAG="$APP_IMAGE_NAME:$PACKAGE_VERSION$SUFFIX"
APP_CACHE_IMAGE_TAG="$APP_IMAGE_NAME:latest-$CI_COMMIT_REF_SLUG"

docker pull "$APP_CACHE_IMAGE_TAG" || true
cp Dockerfile_app Dockerfile
docker build \
  --cache-from "$APP_CACHE_IMAGE_TAG" \
  --tag "$APP_IMAGE_TAG" \
  --tag "$APP_CACHE_IMAGE_TAG" \
  .
kind load docker-image "$APP_IMAGE_TAG" || true

docker push "$APP_IMAGE_TAG"
docker push "$APP_CACHE_IMAGE_TAG"
rm Dockerfile