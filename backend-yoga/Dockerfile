FROM node
ARG node_env
ENV NODE_ENV ${node_env}
EXPOSE 4000
WORKDIR /usr/src/backend-yoga
COPY package*.json ./
RUN npm install --production
COPY . .
CMD sh startup.sh
