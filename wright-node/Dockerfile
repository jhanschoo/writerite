FROM node
WORKDIR /usr/src/acolyte-node
COPY package*.json ./
RUN npm install --production
COPY . .
COPY .dockerbuild/client-models/* src/client-models/
CMD npm run start:dev
