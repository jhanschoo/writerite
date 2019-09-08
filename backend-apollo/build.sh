set -e

prisma deploy
apollo service:push --tag="$NODE_ENV"
tsc
