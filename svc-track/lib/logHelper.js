var Logger = require('bunyan'),
log = new Logger.createLogger({
  name: 'svc-track',
  serializers: { req: Logger.stdSerializers.req }
});

module.exports = {
  log: log
}