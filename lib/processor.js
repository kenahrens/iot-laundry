var Jimp = require('jimp');
var cv = require('opencv');

var hashArr = require('./hashes.json');

var processor = {};

// For a given image this gets the mask of just the digits
processor.getMask = function getMask(mat) {
  var mean = mat.mean();
  // var matOut = new cv.Matrix(mat.width(), mat.height(), cv.Constants.CV_8UC1);
  // var buf = Buffer(mat.width() * mat.height());
  // buf.fill(255);
  // matOut.put(buf);

  // First check the mean to detect if it's a light or dark image
  if (mean[0] < 50 && mean[1] < 50 && mean[2] < 50) {
    // Range of colors we want to keep
    lowerGreen = [0, 100, 80];
    upperGreen = [255, 255, 255];
    mat.inRange(lowerGreen, upperGreen);
  } else if (mean[0] > 50 && mean[1] > 50 && mean[2] > 50) {
    // Range of colors we want to keep
    lowerGreen = [0, 80, 20];
    upperGreen = [40, 200, 60];
    mat.inRange(lowerGreen, upperGreen);
  } else {
    console.log('This image can\'t be read');
  }
  // return mat;
}

processor.hashBuffer = function hashBuffer(buff, cb) {
  cv.readImage(buff, function(error, mat) {
    var buffTest = mat.toBuffer();
    var matMask = processor.getMask(mat);
    var buffMask = mat.toBuffer();
    // var buffMask = matMask.getBuffer();

    Jimp.read(buffMask, function(err, img) {
      if (err) throw err;

      // Send the hashed value to the callback
      cb(img.hash());
    });
  });
}

// Compare this hash with the other hashes
// Will return the most likely match for this image
processor.getNumber = function getNumber(imgHash) {
  var num = 0;
  var diffPct = 1;
  console.log('Compare: ' + imgHash + ' against ' + hashArr.length + ' hashes');
  for (var i=0; i < hashArr.length; i++) {
    var knownHash = hashArr[i].hash;
    var diff = distance(imgHash, knownHash);
    // console.log(hashArr[i].name + ': ' + diff);
    if (diff < diffPct) {
      // console.log(hashArr[i].name + ': ' + diff + '(match)');
      var num = hashArr[i].num;
      diffPct = diff;
    }
  }
  return num;
}

// From phash implementation of jimp
// https://github.com/oliver-moran/jimp/blob/master/phash.js
var distance = function (s1, s2) {
    var counter = 0;
    for (let k = 0; k < s1.length; k++) {
        if (s1[k] !== s2[k]) {
            counter++;
        }
    }
    return (counter / s1.length);
};

module.exports = processor;