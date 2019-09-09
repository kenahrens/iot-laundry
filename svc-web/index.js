var newrelic = require('newrelic');

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var store = require('./lib/store');

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
    var fIndex = fname.indexOf("rpi-");
    var lIndex = fname.lastIndexOf("-");
    var tsLatest = fname.substring(fIndex + 4, lIndex);
    var tsNow = (new Date).getTime();
    var tsDiff = (tsNow - tsLatest) / 1000;
    resMsg += '<h1>Last Image Taken: ' + tsDiff + ' sec ago</h1>';
  }
  
  resMsg += '<table><tr><th>Image</th><th>Prediction</th></tr>';

  // Loop through the pictures
  for (var i=pictures.length; i >= 0; i--) {
    if (j >= 10) { break; }
    var pic = pictures[i];
    if (pic != null) {
      pic = pic.substring(9); // Cut off the ./archive from the front
      resMsg += '<tr><td><img src=' + pic + '></td>';
      var fIndex = pic.lastIndexOf('-');
      var lIndex = pic.lastIndexOf('.');
      var prediction = pic.substring(fIndex + 1, lIndex)
      resMsg += '<td>' + prediction + '</td></tr>'
    }
    j++;
  }
  resMsg += '</table></html>';
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
    console.log('Just received image of size:', req.body.length);
    
    // Check the prediction service
    var options = {
      method: 'POST',
      url: 'http://svc-predict:5000/predict',
      body: req.body,
      headers: {
        'Content-Type': 'image/jpeg'
      }
    };
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
      var jBody = JSON.parse(body);
      var filename = 'rpi-' + ts + '-' + jBody.predict + '.jpg';

      newrelic.addCustomAttribute('imgFilename', filename);
      newrelic.addCustomAttribute('prediction', jBody.predict);
      newrelic.addCustomAttribute('confidence', jBody.confidence);

      if (jBody.predict != 0) {
        // Only store non-zero pictures
        var fullFilename = store.storePicture(ts, filename, req.body, jBody.predict);
            
        // Add to the pictures array, and remove oldest value if needed
        pictures.push(fullFilename);
        if (pictures.length >= 100) {
          pictures.splice(1,1);
        }
        console.log('Storing this picture of a', jBody.predict);
      } else {
        console.log('Skipping this picture of a 0');
      }

      // Build the response back to the raspberry pi
      var resMsg = {
        result: 'success',
        predict: jBody.predict,
        confidence: jBody.confidence,
        filename: filename,
        size: req.body.length
      }

      // Publish the response message to the track service
      pubToTrack(resMsg);

      // Send the response message back to the raspberry pi
      res.send(resMsg);
    });
  } else {
    console.error('Some problem getting file.');
    res.status(500);
    res.send({result: 'failed'});
  }
});

var pubToTrack = function(resMsg) {
  var options = {
    method: 'POST',
    url: 'http://svc-track:8889/storePredict',
    body: resMsg,
    json: true
  };
  request.post(options, function(error, response, body) {
    // Check for errors
    if (error) {
      throw new Error(error);
    }

    // Check for bad status
    if (response.statusCode != 200) {
      throw new Error('Bad response code: ' + response.statusCode);
    }

    // We must have good data
    console.log('Response from svc-track:', body);
  });
}

// Allow loading of the images
app.use(express.static('archive'));

// Setup the main listener
app.listen(port, function() {
  console.log('iot-laundry listening on port: ' + port);
});
