FROM node:10-slim

EXPOSE 8889

ADD . /app
WORKDIR /app

RUN npm install

CMD (sleep 5; node index.js)

