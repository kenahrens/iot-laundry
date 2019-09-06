var restify = require('restify'),
  Logger = require('bunyan'),
  log = new Logger.createLogger({
    name: 'svc-store',
    serializers: { req: Logger.stdSerializers.req }
  }),
  server = restify.createServer({
    name: 'svc-store',
    log: log
  });

server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

const Influx = require('influx');
const influx = new Influx.InfluxDB({
  host: 'msi',
  database: 'laundry',
  schema: [
    {
      measurement: 'laundry_timer',
      fields: {
        predict: Influx.FieldType.INTEGER,
        confidence: Influx.FieldType.FLOAT,
        size: Influx.FieldType.INTEGER
      },
      tags: []
    }
  ]
})

// https://stackoverflow.com/questions/20626470/is-there-a-way-to-log-every-request-in-the-console-with-restify
server.pre(function(req, rsp, next) {
  req.log.info({req: req}, 'REQUEST');
  next();
})

function rspIndex(req, res, next) {
  res.send('The time is ' + new Date());
  next();
}

// Should have the following parameters:
// predict, confidence, filename, size
function rspPrediction(req, res, next) {

  influx.writePoints([
    {
      measurement: 'laundry_timer',
      fields: {
        predict: req.body.predict,
        confidence: req.body.confidence,
        size: req.body.size
      }
    }
  ])

  var rspInfo = {
    result: 'success'
  }
  res.send(rspInfo);
  next();
}

server.get('/', rspIndex);
server.post('/storePredict', rspPrediction);

var port = process.env.PORT || 8889;
server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});