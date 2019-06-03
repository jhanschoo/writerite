FROM node
WORKDIR /usr/src/acolyte-node
COPY package*.json ./
RUN npm install --production
COPY . .
CMD npm run start:production
