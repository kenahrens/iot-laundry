var Jimp = require('jimp');

var processor = {};

processor.hashBuffer = function hashBuffer(buff, cb) {
  Jimp.read(buff, function(err, img) {
    if (err) throw err;

    // Send the hashed value to the callback
    cb(img.hash());
  });
}

module.exports = processor;