var processor = require('../lib/processor.js');

var fs = require('fs');
var assert = require('assert');

// This image used for testing the reading code, 
var imgLight = './test/images/light-0-orig.jpg';
// var hashLight12 = 'bj9gsM0800g';
var hashLight = '00000000000';
var numLight = '0';

// Runtime values
var buffLight, tstHashLight;

describe('processor tests', function() {

  it('reads test image light 12', function(done) {
    buffLight = fs.readFileSync(imgLight);
    done();
  });

  it('hashes the test image light 12', function(done) {
    processor.hashBuffer(buffLight, function(hash) {
      tstHashLight = hash;
      assert.equal(hash, hashLight);
      done();
    })
  });

  it('gets the number for test image light 12', function(done) {
    var num = processor.getNumber(tstHashLight);
    assert.equal(num, numLight);
    done();
  });
});
