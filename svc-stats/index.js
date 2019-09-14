var newrelic = require('newrelic');

const {server, log} = require('./lib/restify.js');
const { influx } = require('./lib/influx.js');

const QUERY = 'select * from laundry_timer WHERE time > now() - 60m ORDER BY time DESC';

influx.ping(5000).then(hosts => {
  hosts.forEach(host => {
    if (host.online) {
      log.info(`${host.url.host} responded in ${host.rtt}ms running ${host.version})`)
    } else {
      log.info(`${host.url.host} is offline :(`)
    }
  })
})

function checkValid(result) {
  if ((result != 0) && result.length > 0) {
    return true;
  }
  return false;
}

// Check if the first few values are 0s
function checkStatus(result) {
  var status = 'Stopped';
  if (checkValid(result)) {
    for (var i=0; i < 3; i++) {
      var row = result[i]
      if (row.predict !== 0) {
        status = 'Running';
      }
    }
  } else {
    status = 'Offline';
  }
  return status;
}

function getLatestPredict(result) {
  if (checkValid(result)) {
    return result[0].predict;
  }
  return null;
}

function getLatestConfidence(result) {
  if (checkValid(result)) {
    var confidence = result[0].confidence;
    confidence = confidence * 100.0;
    return confidence.toFixed(2);
  }
  return null;
}

function rspStats(req, res, next) {
  influx.query(QUERY)
  .then(
    (result) => {
      var rspInfo = {
        status: checkStatus(result),
        predict: getLatestPredict(result),
        confidence: getLatestConfidence(result)
      }
      res.send(rspInfo);
      next();
    }
  )
}

server.get('/stats', rspStats);