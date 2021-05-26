import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter, Switch} from 'react-router-dom';
import {CookiesProvider} from "react-cookie";

import App from './layouts/App/App';
import reportWebVitals from './reportWebVitals';
import LoginPage from "./layouts/Login/LoginPage";



const routing = (
    <CookiesProvider>
        <BrowserRouter>
            <React.StrictMode>
                <Switch>
                    <Route exact path="/" render={(props) => <LoginPage  />}  />
                    <Route path="/dashboard" render={(props) => <App {...props} />}  />
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
