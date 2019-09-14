import React from 'react';
import './App.css';

// Connect to Influx
const Influx = require('influx');


class App extends React.Component {

  constructor(props) {
    super(props)

    // Create DB connection
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
    })


    this.state = {
      influx: influx,
      status: null,
      predict: null,
      confidence: null,
      duration: null,
      result: null
    }
  }

  getCurrentStatus() {
    this.state.influx.query('select * from laundry_timer WHERE time > now() - 60m ORDER BY time DESC')
    .then(
      (result) => {

        // Check if the first few values are 0s
        var status = 'Stopped';
        for (var i=0; i < 3; i++) {
          var row = result[i]
          if (row.predict !== 0) {
            status = 'Running';
          }
        }

        // Get the most recent prediction
        var predict = -1;
        var confidence = 0;
        if ((result != null) && (result.length > 0)) {
          predict = result[0].predict
          confidence = (100 * result[0].confidence) + ' %'
        }

        this.setState({
          status: status,
          predict: predict,
          confidence: confidence
        })
      },
      (error) => {
        this.setState( {
          error
        })
      }
    )
  }

  getRemaining() {

  }

  getDuration() {}

  componentDidMount() {
    this.getCurrentStatus();
  }

  render() {
    const {error, status, predict, confidence} = this.state;
    if (error) {
      return <div>Error: {error.message}</div>
    } else {
      return (
        <div className="App">
          <h1>Laundry Server</h1>
          <div>
            <b>Status:</b> {status}
          </div>
          <div>
            <b>Predict:</b> {predict}
          </div>
          <div>
            <b>confidence:</b> {confidence}
          </div>
        </div>
      )
    }
  }
}

export default App;
