FROM node
EXPOSE 4000
WORKDIR /usr/src/backend-yoga
COPY package*.json ./
RUN npm install --production
COPY . .
ARG node_env
ENV NODE_ENV ${node_env}
CMD sh startup.sh
