if [ "${NODE_ENV}" = "debug" ]
then
  sleep infinity
fi
npx prisma deploy
npm run start