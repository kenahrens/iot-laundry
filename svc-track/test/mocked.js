const sinon = require('sinon');
const request = require('supertest');

const { server } = require('../server.js');
const { influxHelper } = require('../lib/influxHelper.js');

var stubPing = null;
var stubWrite = null;

describe('Server test', function() {
  before(function(done) {
    // Mock out the influx library
    stubPing = sinon.stub(influxHelper, "testConnect").resolves([]);
    stubWrite = sinon.stub(influxHelper, "writePoints").resolves();
    done();
  })

  it('Handles GET / and responds with JSON', function(done) {
    request(server)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200, done);
  })

  it('Handles POST /storePredict', function(done) {
    request(server)
      .post('/storePredict')
      .send({predict:7, confidence:0.99, size:555})
      .expect('Content-Type', /json/)
      .expect(200, done);
  })

  after(function(done){
    if (stubPing != null) { stubPing.restore(); }
    if (stubWrite != null) { stubWrite.restore(); }
    server.close(done);
  })
})