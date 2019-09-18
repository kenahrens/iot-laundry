const { influxHelper } = require('../lib/influxHelper');

// Should have the following parameters:
// predict, confidence, size
function rspPredict(req, res, next) {
  let fields = {
    predict: req.body.predict,
    confidence: req.body.confidence,
    size: req.body.size
  }

  influxHelper.writePoints(fields)
    .then(() => {
      var rspInfo = {
        result: 'success'
      }
      res.send(rspInfo);
      next();
    });
}

module.exports = {
  storeRoute: function(server) {
    server.post('/storePredict', rspPredict);
  }
}