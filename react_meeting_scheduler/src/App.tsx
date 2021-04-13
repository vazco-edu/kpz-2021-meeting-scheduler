import { ReactComponent } from '*.svg';
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
        <h1>This is Meeting Scheduler</h1>
      </div>
    )
  }
}

export default connection;