var processor = require('../lib/processor.js');

var fs = require('fs');
var assert = require('assert');

// This image used for testing the reading code, 
var imgLight12 = './test/images/light-12-orig.jpg';
var hashLight12 = 'bj9gsM0800g';
var numLight = '12';

// Runtime values
var buffLight, tstHashLight;

describe('processor tests', function() {

  it('reads test image light 12', function(done) {
    buffLight = fs.readFileSync(imgLight12);
    done();
  });

  it('hashes the test image light 12', function(done) {
    processor.hashBuffer(buffLight, function(hash) {
      tstHashLight = hash;
      assert.equal(hash, hashLight12);
      done();
    })
  });

  it('gets the number for test image light 12', function(done) {
    var num = processor.getNumber(tstHashLight);
    assert.equal(num, numLight);
    done();
  });
});
