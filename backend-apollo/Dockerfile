FROM node
EXPOSE 4000
WORKDIR /usr/src/backend-apollo
COPY backend-apollo/package*.json ./
COPY schema.graphql ./
RUN npm install --production
COPY backend-apollo .
ARG node_env
ENV NODE_ENV ${node_env}
CMD sh startup.sh
