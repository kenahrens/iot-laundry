var newrelic = require('newrelic');

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

// These are used to store the files
var fs = require('fs');
var moment = require('moment');
var mkdirp = require('mkdirp');

// Initialization
var port = process.env.PORT || 3000;
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
  var resMsg = '<html><head>';
  resMsg += newrelic.getBrowserTimingHeader();
  resMsg += '<title>IoT Laundry</title></head><body>';
  var j=0;

  // Get the filename of the newest picture
  var fname = pictures[pictures.length-1];
  if (fname != null) {
    var tsLatest = fname.substring(fname.lastIndexOf('-')+1, fname.lastIndexOf('.'));
    var tsNow = (new Date).getTime();
    var tsDiff = (tsNow - tsLatest) / 1000;
    resMsg += '<h1>Last Image Taken: ' + tsDiff + ' sec ago</h1>';
  }

  // Loop through the pictures
  for (var i=pictures.length; i >= 0; i--) {
    if (j >= 10) { break; }
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
  if (req.body != null) {
    var ts = new Date().getTime();
    var filename = 'rpi-' + ts + '.jpg';
    console.log('Just received image', filename, 'of size:', req.body.length);
    
    // Check the prediction service
    var options = {
      method: 'POST',
      url: 'http://svc-predict:5000/predict',
      body: req.body,
      headers: {
        'Content-Type': 'image/jpeg'
      }
    };
    console.log('About to POST to predict service', options);
    request(options, function (error, response, body) {
      // Check for errors
      if (error) {
        throw new Error(error);
      }

      // Check for bad status
      if (response.statusCode != 200) {
        throw new Error('Bad response code: ' + response.statusCode);
      }

      // We must have good data
      jBody = JSON.parse(body)
      if (jBody.predict != 0) {
        // Only store non-zero pictures
        storePicture(ts, filename, req.body);
      } else {
        console.log('Skipping this picture of a 0');
      }

      // Send the response back to the raspberry pi
      var resMsg = {
        result: 'success',
        predict: jBody.predict,
        confidence: jBody.confidence,
        filename: filename,
        size: req.body.length
      }
      res.send(resMsg);
    });
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
    fs.writeFileSync(fullFilename, body);
    
    // Add to the pictures array, and remove oldest value if needed
    pictures.push(fullFilename);
    if (pictures.length >= 100) {
      pictures.splice(1,1);
    }

    // Custom attributes for NR
    newrelic.addCustomAttribute('imgFilename', filename);
    newrelic.addCustomAttribute('imgFullFilename', fullFilename);
    newrelic.addCustomAttribute('imgLength', body.length);
  });
}

// Allow loading of the images
app.use(express.static('archive'));

// Setup the main listener
app.listen(port, function() {
  console.log('iot-laundry listening on port: ' + port);
});
