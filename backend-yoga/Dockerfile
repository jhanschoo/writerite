FROM node
EXPOSE 4000
WORKDIR /usr/src/backend-yoga
COPY package*.json ./
RUN npm install --production
COPY . .
CMD sh startup.sh
