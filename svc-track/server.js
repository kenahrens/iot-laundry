// var newrelic = require('newrelic');

const { server } = require('./lib/restifyHelper.js');
const { log } = require('./lib/logHelper.js');
const { influxHelper } = require('./lib/influxHelper.js');

const { indexRoute } = require('./routes/index.js');
const { storeRoute } = require('./routes/storePredict.js');

initInflux();
indexRoute(server);
storeRoute(server);

function initInflux() {
  influxHelper.connect();
  influxHelper.testConnect(5000);
  log.info('Influx initialization started');
}

module.exports = {
  server: server
}