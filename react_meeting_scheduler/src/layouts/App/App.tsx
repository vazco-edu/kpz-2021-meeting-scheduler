import React, {Component, useState} from 'react';
import axios from 'axios';
import Dashboard from "./Dashboard";
import {Redirect} from "react-router-dom";

const authAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
})

class App extends Component {
    render() {

    if(! localStorage.getItem("access_token")){
        return <Redirect to={'/'}/>;
    }

        return (
            <div className="App">
                <Dashboard/>
            </div>
        )
    }

    simplePOST = async () => {
        try {
            let res = await authAxios.post(
                "/dj-rest-auth/token/verify/",
                {
                    token: localStorage.getItem("access_token"),
                }
            );
            console.log(res);
            return res.status;
        } catch (err) {
            console.log(err.message);
        }
    };

}

export default App;