FROM node
EXPOSE 4000
WORKDIR /usr/src/backend-apollo
COPY package*.json ./
COPY schema.prisma ./
ARG node_env
ENV NODE_ENV ${node_env}
RUN npm install
COPY . .
RUN npx prisma generate
RUN npx tsc
CMD npm run start
