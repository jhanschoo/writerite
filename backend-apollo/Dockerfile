FROM node
EXPOSE 4000
WORKDIR /usr/src/backend-apollo
COPY package*.json ./
RUN npm install --production
COPY . .
ARG node_env
ENV NODE_ENV ${node_env}
CMD npm run start
