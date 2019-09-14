FROM node:10-alpine

EXPOSE 8890

ADD . /app
WORKDIR /app

RUN npm install

CMD (sleep 5; node index.js)
