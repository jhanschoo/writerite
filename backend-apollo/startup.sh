set -e
if [ "${NODE_ENV}" = "debug" ]
then
  sleep infinity
fi
ls
npx prisma deploy
npm run start