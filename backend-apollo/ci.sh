#!/usr/bin/env zsh

set -e

cd "$(dirname "$(realpath "$0")")"
echo "$PRISMA_CONFIG" > prisma_envfile
cat prisma_envfile
npm install
