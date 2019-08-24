FROM node
WORKDIR /usr/src/wright-node
COPY package*.json ./
RUN npm install --production
COPY . .
CMD npm run start:dev
