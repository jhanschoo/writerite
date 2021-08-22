FROM node:14
EXPOSE 4000
WORKDIR /usr/src/backend-apollo
COPY package*.json ./
COPY schema.prisma ./
ARG node_env
ARG graph_variant
ENV NODE_ENV ${node_env}
ENV GRAPH_VARIANT ${graph_variant}
# prisma generate happens on the following command due to the postinstall hook of @prisma/client
RUN npm ci
COPY . .
# workaround for https://github.com/graphql-nexus/nexus/pull/919
COPY patch_node_modules node_modules
RUN npm run build
CMD npm run start
