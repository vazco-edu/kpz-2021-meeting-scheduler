import { ReactComponent } from '*.svg';
import React, {Component} from 'react';
import GoogleForm from './components/GoogleLoginComponent';
import { Button } from '@material-ui/core';
import axios from 'axios';
import CalendarCard from "./components/CalendarCard";

const authAxios = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers:{
    Authorization: `Bearer ${localStorage.getItem("access_token")}`
  }
})

class App extends Component{

    componentDidMount(){
      const apiUrl = 'http://127.0.0.1:8000/api/aa';
      fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => console.log(data));
    }
    render(){
      return (
        <div className="App">
          <Button onClick={this.simplePOST}>"Click"</Button>
          <h1>This is Meeting Scheduler</h1>
          <h1>This is home page</h1>
            <div id='calendars'>
            </div>
        <GoogleForm />
        </div>        
      )
    }

  simplePOST = async() => {
    try {
      let res = await authAxios.post(
          "/dj-rest-auth/token/verify/",
          {
              token: localStorage.getItem("access_token"),
          }
      );
      console.log(res);
      return res.status;
    } catch(err){
      console.log(err.message);
    }
    
};

}

export default App;