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

// Array with the 100 most recent pictures
var pictures = [];

// Return a page with the most recent images
app.get('/', function(req, res) {
  console.log('GET /');
  var resMsg = '<html><head><title>IoT Laundry</title></head><body>';
  var j=0;
  for (var i=pictures.length; i >= 0; i--) {
    if (j >= 5) { break; }
    var pic = pictures[i];
    if (pic != null) {
      pic = pic.substring(9); // Cut off the ./archive from the front
      resMsg += '<img src=' + pic + '><br>';
    }
    j++;
  }
  resMsg += '</html>';
  res.send(resMsg);
});

// Show some stats
app.get('/stats', function(req, res) {
  console.log('GET /stats');
  var resMsg = { pictures: pictures.length };
  for (var i=pictures.length; i >= 0; i--) {
    resMsg[i] = pictures[i];
  }
  res.send(resMsg);
});

// This receives the POST with a raw image parser
app.post('/img', imgParser, function(req, res, next) {
  console.log('POST /img');
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

    // Store the pictures
    storePicture(ts, filename, req.body);

  } else {
    console.error('Some problem getting file.');
    res.status(500);
    res.send({result: 'failed'});
  }
});

// Helper function to store off a picture
// TODO: Move to library function
var storePicture = function storePicture(ts, filename, body) {
  // Write new files to the archives directory
  var mo = moment(parseInt(ts));
  var dirname = './archive/' + mo.format('YYYY-MM-DD') + '/' + mo.format('HH');
  
  // Create the directory
  mkdirp(dirname, function(err) {
    if (err) {
      throw err;
    }
    var fullFilename = dirname + '/' + filename;
    fs.writeFile(fullFilename, body);
    pictures.push(fullFilename);
    if (pictures.length >= 100) {
      pictures.pop();
    }
  })
}

// Allow loading of the images
app.use(express.static('archive'));

// Setup the main listener
app.listen(port, function() {
  console.log('iot-laundry listening on port: ' + port);
});