var processor = require('../lib/processor.js');

var fs = require('fs');
var assert = require('assert');

var imgLight = '';
var buffLight;
var hashLight = 'bj9gsM0800g';

describe('processor tests', function() {
  it('reads a test image', function(done) {
    var fname = './test/images/light-12-orig.jpg';
    buffLight = fs.readFileSync(fname);
    done();
  });

  it('hashes the test image', function(done) {
    processor.hashBuffer(buffLight, function(hash) {
      assert.equal(hash, hashLight);
      done();
    })
  });
})