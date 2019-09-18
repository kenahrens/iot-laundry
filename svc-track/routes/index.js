function rspIndex(req, res, next) {
  res.send('The time is ' + new Date());
  next();
}

module.exports = {
  indexRoute: function(server) {
    server.get('/', rspIndex);
  }
}