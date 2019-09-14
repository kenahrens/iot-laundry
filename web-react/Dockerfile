FROM node:10-slim

EXPOSE 5000

ADD . /app
WORKDIR /app

RUN yarn install
RUN yarn build

CMD npx serve build
