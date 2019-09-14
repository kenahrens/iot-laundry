const Influx = require('influx');
const influx = new Influx.InfluxDB({
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

module.exports = {
  influx: influx
}