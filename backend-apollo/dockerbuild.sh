#!/usr/bin/env zsh

# Run in writerite/backend-apollo/
# A .env file needs to be present with the following envvars defined:
# PRISMA_ENDPOINT
# ENGINE_API_KEY

set -e

NODE_ENV="development"
if [[ -n "$1" ]]
then
  NODE_ENV="$1"
fi
export NODE_ENV

PACKAGE_VERSION=$(node -pe "require('./package.json').version")
SUFFIX="-${NODE_ENV}"
if [[ "${SUFFIX}" == "-development" ]]
then
  SUFFIX="-dev1"
fi
if [[ "${SUFFIX}" == "-production" ]]
then
  SUFFIX=""
fi

npm run build

IMAGE_NAME="jhanschoo/writerite-backend-apollo:${PACKAGE_VERSION}${SUFFIX}"
docker build -t "$IMAGE_NAME" --build-arg node_env="$NODE_ENV" .
docker push "$IMAGE_NAME"
