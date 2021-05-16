import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Route, BrowserRouter, Switch} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import {CookiesProvider, Cookies} from "react-cookie";
import LoginPage from "./components/LoginPage";


const routing = (
    <CookiesProvider>
        <BrowserRouter>
            <React.StrictMode>
                <Switch>
                    <Route exact path="/" component={LoginPage}/>
                    <Route exact path="/dashboard" component={App}/>
                </Switch>
            </React.StrictMode>
        </BrowserRouter>
    </CookiesProvider>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
