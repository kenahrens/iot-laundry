FROM node:10-alpine

EXPOSE 5000

ADD . /app
WORKDIR /app

RUN yarn install
RUN yarn build

CMD npx serve build
