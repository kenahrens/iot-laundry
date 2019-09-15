var newrelic = require('newrelic');

const {server, log} = require('./lib/restify.js');
const store = require('./lib/store');

function rspStore(req, res, next) {
  
  // Get timestamp
  var ts = new Date().getTime();
  var predict = req.params.predict;
  var filename = 'rpi-' + ts + '-' + predict + '.jpg';

  // Store the picture
  if (predict > 0) {
    var fullFilename = store.storePicture(ts, filename, req.body, predict);
    log.info(fullFilename);
  }

  // Return a success result
  var rspInfo = {
    filename: fullFilename,
    size: req.body.length
  }
  res.send(rspInfo);
  next();
}


server.post('/storeImg/:predict', rspStore);
