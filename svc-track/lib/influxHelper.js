var { log } = require('./logHelper.js');
const Influx = require('influx');

var helper = {};

helper.influx = '';

helper.connect = function() {  
  // Create the DB connection
  helper.influx = new Influx.InfluxDB({
    host: '192.168.189.24',
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
  });
}

helper.testConnect = function(timeout) {
  helper.influx.ping(timeout).then(hosts => {
    hosts.forEach(host => {
      if (host.online) {
        log.info(`${host.url.host} responded in ${host.rtt}ms running ${host.version})`)
      } else {
        log.info(`${host.url.host} is offline :(`)
      }
    })
  })
}

helper.writePoints = function(fields) {
  return helper.influx.writePoints([
    {
      measurement: 'laundry_timer',
      fields: fields
    }
  ]);
}

module.exports = {
  influxHelper: helper
}