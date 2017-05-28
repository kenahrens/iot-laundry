var processor = require('../lib/processor.js');
var fs = require('fs');

var buffLight;

describe('processor tests', function() {
  it('reads a test image', function(done) {
    var fname = './test/images/light-12-orig.jpg';
    buffLight = fs.readFileSync(fname);
    done();
  });

  it('masks the test image', function(done) {
    done();
  });
})