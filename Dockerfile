FROM node:12.21-slim as node-base
RUN apt-get update && apt-get -y install wget
RUN mkdir /confd
RUN wget -O '/confd/confd' 'https://github.com/kelseyhightower/confd/releases/download/v0.15.0/confd-0.15.0-linux-amd64'
RUN chmod +x /confd/confd

FROM node:12.21-slim as build
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node-base as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV SERVER_PORT=8080
WORKDIR /usr/app
RUN mkdir ./confd
RUN cp /confd/confd ./confd/confd
COPY ./run.sh ./run.sh
RUN chmod +x run.sh
COPY ./package*.json ./
RUN npm install --only=production
COPY ./docs ./docs
COPY ./confd ./confd

COPY --from=build /usr/src/app/dist .

HEALTHCHECK CMD wget http://127.0.0.1:${SERVER_PORT}/liveness -O /dev/null || exit 1

RUN chmod 777 ./confd && mkdir config && chmod 777 ./config

CMD ["./run.sh"]
