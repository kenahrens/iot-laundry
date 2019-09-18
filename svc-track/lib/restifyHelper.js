var restify = require('restify');
var { log } = require('./logHelper');

server = restify.createServer({
  name: 'svc-track',
  log: log
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// https://stackoverflow.com/questions/20626470/is-there-a-way-to-log-every-request-in-the-console-with-restify
server.pre(function(req, rsp, next) {
  req.log.info({req: req}, 'REQUEST');
  next();
})

var port = process.env.PORT || 8889;
server.listen(port, function() {
  log.info('%s listening at %s', server.name, server.url);
});

module.exports = {
  server: server
}