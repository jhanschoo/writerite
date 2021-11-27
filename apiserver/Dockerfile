FROM node:14
EXPOSE 4000
WORKDIR /usr/src/apiserver
COPY package*.json ./
COPY schema.prisma ./
# prisma generate happens on the following command due to the postinstall hook of @prisma/client
RUN npm ci --production
COPY . .
# workaround for https://github.com/graphql-nexus/nexus/pull/919 ; should be fixed in nexus@1.2.0
COPY patch_node_modules node_modules
RUN npm run build
CMD npm run app:start
