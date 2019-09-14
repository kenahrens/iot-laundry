var newrelic = require('newrelic');

const {server, log} = require('./lib/restify.js');
const { influx } = require('./lib/influx.js');

influx.ping(5000).then(hosts => {
  hosts.forEach(host => {
    if (host.online) {
      log.info(`${host.url.host} responded in ${host.rtt}ms running ${host.version})`)
    } else {
      log.info(`${host.url.host} is offline :(`)
    }
  })
})

// Should have the following parameters:
// predict, confidence, filename, size
function rspPrediction(req, res, next) {

  influx.writePoints([
    {
      measurement: 'laundry_timer',
      fields: {
        predict: req.body.predict,
        confidence: req.body.confidence,
        size: req.body.size
      }
    }
  ]).then(() => {

    var rspInfo = {
      result: 'success'
    }
    res.send(rspInfo);
    next();  
  });
}


server.post('/storePredict', rspPrediction);

