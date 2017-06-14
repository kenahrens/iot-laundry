var processor = require('../lib/processor.js');

var fs = require('fs');
var assert = require('assert');

// 
var imgDark0 = './test/images/dark-0-orig.jpg';
var imgDark14 = './test/images/dark-14-orig.jpg';
var imgDark37 = './test/images/dark-37-orig.jpg';
var imgLight0 = './test/images/light-0-orig.jpg';
var imgLight12 = './test/images/light-12-orig.jpg';
var imgLight31 = './test/images/light-31-orig.jpg';

var runTest = function runTest(img, num, done) {
  var buff = fs.readFileSync(img);
  processor.hashBuffer(buff, function(hash) {
    var processorNum = processor.getNumber(hash);
    assert.equal(num, processorNum);
    done();
  });
}

describe('Image conversion tests', function() {
  it('Matches dark 0', function(done) {
    runTest(imgDark0, 0, done);
  });
  it('Matches dark 14', function(done) {
    runTest(imgDark14, 14, done);
  });
  it('Matches dark 37', function(done) {
    runTest(imgDark37, 37, done);
  });
  it('Matches light 0', function(done) {
    runTest(imgLight0, 0, done);
  });
  it('Matches light 12', function(done) {
    runTest(imgLight12, 12, done);
  });
  it('Matches light 31', function(done) {
    runTest(imgLight31, 31, done);
  });
});
