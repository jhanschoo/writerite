FROM node:14.7
WORKDIR /usr/src/wright-node
COPY package*.json ./
ARG node_env
ARG graph_variant
ENV NODE_ENV ${node_env}
ENV GRAPH_VARIANT ${graph_variant}
RUN npm ci
COPY . .
RUN npm run build
CMD npm run start
