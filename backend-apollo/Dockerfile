FROM node
EXPOSE 4000
WORKDIR /usr/src/backend-apollo
COPY package*.json ./
COPY schema.prisma ./
ARG node_env
ENV NODE_ENV ${node_env}
ENV GRAPH_VARIANT ${graph_variant}
# prisma generate happens here due to the postinstall hook of @prisma/client
RUN npm install
COPY . .
RUN npx tsc
CMD npm run start
