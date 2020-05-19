set -e

prisma generate
# pull apollo graph and ensure they are identical with local
tsc
