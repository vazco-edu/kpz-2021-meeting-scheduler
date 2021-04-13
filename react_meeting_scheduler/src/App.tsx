import { ReactComponent } from '*.svg';
import { Button } from '@material-ui/core';
import React from 'react';


class connection extends React.Component{
  componentDidMount(){
    const apiUrl = 'http://127.0.0.1:8000/scheduler_api/';
    fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => console.log(data));
  }
  render(){
    return (
      <div className="App">
        <Button onClick={this.simplePOST}>"Zajonc"</Button>
        <h1>This is Meeting Scheduler</h1>
      </div>
    )
  }
  async simplePOST() {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Zajonc' })
    };
    fetch('http://127.0.0.1:8000/scheduler_api', requestOptions)
        .then(response => {
          response.json()
        })
        .catch(e => {
          console.log(e)
        });
}
}

export default connection;