FROM node:10

EXPOSE 8888

ADD . /app
WORKDIR /app

RUN npm install

CMD (sleep 5; node index.js)

