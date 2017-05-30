var newrelic = require('newrelic');

var express = require('express');
var bodyParser = require('body-parser');

// These are used to store the files
var fs = require('fs');
var moment = require('moment');
var mkdirp = require('mkdirp');

// Helper functions
var checkFile = require('./lib/checkFile.js');
var processor = require('./lib/processor.js');

// Initialization
var port = process.env.PORT || 8888;
var app = express();

// Setup image parser to treat image data as raw buffer
var parserOptions = {
  limit: '20mb',
  type: 'image/*'
}
var imgParser = bodyParser.raw(parserOptions);

// Endpoint shows we are still alive
app.get('/', function(req, res) {
  console.log('GET /');
  res.send({alive: true});
});

// This receives the POST with a raw image parser
app.post('/img', imgParser, function(req, res, next) {
  var resMsg = {};
  if (req.body != null) {
    var ts = new Date().getTime();
    var filename = 'rpi-' + ts + '.jpg';
    console.log('Just received image', filename, 'of size:', req.body.length);
    
    var resMsg = {
      result: 'success',
      filename: filename,
      size: req.body.length
    }
    res.send(resMsg);

    // Write new files to the archives directory
    var mo = moment(parseInt(ts));
    var dirname = './archive/' + mo.format('YYYY-MM-DD') + '/' + mo.format('HH');
    mkdirp(dirname, function(err) {
      if (err) { throw err; }
      fs.writeFile(dirname + '/' + filename, req.body);
    });
  } else {
    console.error('Some problem getting file.');
    res.status(500);
    res.send({result: 'failed'});
  }
});

// Setup the main listener
app.listen(port, function() {
  console.log('iot-laundry listening on port: ' + port);
});