import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      status: null,
      predict: null,
      confidence: null,
      duration: null,
      result: null
    }
  }

  getCurrentStatus() {
    fetch("http://msi:8888/stats")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          status: result.status,
          predict: result.predict,
          confidence: result.confidence
        })
      },
      (error) => {
        this.setState( {
          error
        })
      }
    )
  }

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
