#!/usr/bin/env zsh

# Run in project root (i.e. writerite/, and not in writerite/backend-apollo/)

NODE_ENV="development"
if [[ -n "$1" ]]
then
  NODE_ENV="$1"
fi
PACKAGE_VERSION=$(cat backend-apollo/package.json |
  grep version |
  head -1 |
  awk -F: '{ print $2 }' |
  sed 's/[", ]//g'
)
SUFFIX="-${NODE_ENV}"
if [[ "${SUFFIX}" == "-development" ]]
then
  SUFFIX="-dev1"
fi
if [[ "${SUFFIX}" == "-production" ]]
then
  SUFFIX=""
fi
IMAGE_NAME="jhanschoo/writerite-backend-apollo:${PACKAGE_VERSION}${SUFFIX}"
docker build -t "${IMAGE_NAME}" --build-arg node_env="${NODE_ENV}" .
docker push "${IMAGE_NAME}"
