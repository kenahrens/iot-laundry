var Jimp = require('jimp');
var fs = require('fs');

// Generate hashes for all the files
var imgPath = './training/dst/';
var resPath = './training/';

var fileCount = 0;
var runningCount = 0;
var hashes = {};

// Grab just the number from the filename
// ex: dark-28-clean.jpg returns 28
var getValue = function getValue(fname) {
  var iDash1 = fname.indexOf('-') + 1;
  var iDash2 = fname.indexOf('-', iDash1);
  var value = fname.substring(iDash1, iDash2)
  if (value == 'none') {
    value = '0';
  }
  return value;
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
  var value = getValue(fname);
  console.log('save hash: ' + shortName + ' (' + value + ') ' + hash);
  hashes[hash] = {
    name: shortName,
    value: value,
    hash: hash
  };

  // Check if we got all the data
  if (runningCount == fileCount) {
    console.log('Got all the hashes: ' + runningCount + ', store off results');
    var resultFname = resPath + 'hashes.json';
    fs.writeFileSync(resultFname, JSON.stringify(hashes));
    console.log(resultFname + ' written.');
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
