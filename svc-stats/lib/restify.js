var restify = require('restify'),
Logger = require('bunyan'),
log = new Logger.createLogger({
  name: 'svc-stats',
  serializers: { req: Logger.stdSerializers.req }
}),
server = restify.createServer({
  name: 'svc-stats',
  log: log
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// https://stackoverflow.com/questions/20626470/is-there-a-way-to-log-every-request-in-the-console-with-restify
server.pre(function(req, rsp, next) {
  req.log.info({req: req}, 'REQUEST');
  rsp.header('Access-Control-Allow-Origin', '*');
  next();
})

function rspIndex(req, res, next) {
  res.send('The time is ' + new Date());
  next();
}

server.get('/', rspIndex);
var port = process.env.PORT || 8890;
server.listen(port, function() {
  log.info('%s listening at %s', server.name, server.url);
});

module.exports = {
  server: server,
  log: log
}