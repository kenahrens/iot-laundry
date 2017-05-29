var Jimp = require('jimp');
var fs = require('fs');

// Generate hashes for all the files
var imgPath = './training/images/';
var hashResult = './lib/hashes.json';

var fileCount = 0;
var runningCount = 0;
var hashes = {};

// Grab just the number from the filename
// ex: dark-28-clean.jpg returns 28
var getNumber = function getNumber(fname) {
  var iDash = fname.indexOf('-') + 1;
  var iDot = fname.lastIndexOf('.');
  var num = fname.substring(iDash, iDot)
  return num;
}

// Strip off the path and just get the filename (no extension)
var getShortName = function getShortName(fname) {
  var iSlash = fname.lastIndexOf('/') + 1;
  var iPeriod = fname.lastIndexOf('.');
  var shortName = fname.substring(iSlash, iPeriod);
  return shortName;
}

// Save the hash and check if we got them all
var saveHash = function saveHash(fname, hash) {
  var shortName = getShortName(fname);
  var num = getNumber(fname);
  console.log('save hash: ' + shortName + ' (' + num + ') ' + hash);
  hashes[hash] = {
    name: shortName,
    num: num,
    hash: hash
  };

  // Check if we got all the data
  if (runningCount == fileCount) {
    console.log('Got all the hashes: ' + runningCount + ', store off results');
    fs.writeFileSync(hashResult, JSON.stringify(hashes));
    console.log(hashResult + ' written.');
  }
}

// Calculate the hash for a given file
var hashFile = function hashFile(fname) {
  if (fname.endsWith('jpg')) {
    Jimp.read(fname, function(err, img) {
      if (err) { throw err; }
      var hash = img.hash();
      runningCount++;
      saveHash(fname, hash);
    });
  } else {
    console.log('Skipping: ' + fname);
  }
}

// Start by reading the list of files from path
fs.readdir(imgPath, function(err, items) {
  fileCount = items.length;
  console.log('We need to read: ' + fileCount + ' files.')
  for(var i=0; i < items.length; i++) {
    var fname = imgPath + items[i];
    hashFile(fname);
  }
});
