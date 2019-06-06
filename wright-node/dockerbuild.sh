#!/usr/bin/env zsh

NODE_ENV="development"
if [[ -n "$1" ]]
then
  NODE_ENV="$1"
fi
PACKAGE_VERSION=$(cat package.json |
  grep version |
  head -1 |
  awk -F: '{ print $2 }' |
  sed 's/[", ]//g'
)
SUFFIX="-${NODE_ENV}"
if [[ "${SUFFIX}" == "-development" ]]
then
  SUFFIX="-dev2"
fi
if [[ "${SUFFIX}" == "-production" ]]
then
  SUFFIX=""
fi
IMAGE_NAME="jhanschoo/writerite-wright-node:${PACKAGE_VERSION}${SUFFIX}"
docker build -t "${IMAGE_NAME}" --build-arg node_env="${NODE_ENV}" .
docker push "${IMAGE_NAME}"
