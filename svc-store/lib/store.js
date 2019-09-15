// These are used to store the files
var fs = require('fs');
var moment = require('moment');
var mkdirp = require('mkdirp');

// Helper function to store off a picture
var storePicture = function storePicture(ts, filename, body, predict) {
  // Write new files to the archives directory
  var mo = moment(parseInt(ts));
  // var dirname = './archive/' + mo.format('YYYY-MM-DD') + '/' + mo.format('HH');
  
  // Create the directory for the day with sub directory for predictions
  var dirname = './archive/' + mo.format('YYYY-MM-DD') + '/' + predict;
  var fullFilename = dirname + '/' + filename;

  // Create the directory
  mkdirp(dirname, function(err) {
    if (err) {
      throw err;
    }
    
    fs.writeFileSync(fullFilename, body);
  });
  return fullFilename;
}

module.exports = {
  storePicture: storePicture
}