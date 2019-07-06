FROM node:10

EXPOSE 8888

ADD . /app
WORKDIR /app

RUN apt-get update && apt-get install libopencv-dev python-opencv -y
RUN npm install

CMD (sleep 5; node index.js)

