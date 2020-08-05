FROM node
EXPOSE 4000
WORKDIR /usr/src/backend-apollo
COPY package*.json ./
COPY schema.prisma ./
ARG node_env
ENV NODE_ENV ${node_env}
# prisma generate is performed here hooked to installation of @prisma/client
RUN npm install
COPY . .
RUN npx tsc
CMD npm run start
