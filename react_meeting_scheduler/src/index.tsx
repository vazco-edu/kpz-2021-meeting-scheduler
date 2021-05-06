import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { CookiesProvider, Cookies } from "react-cookie";

const routing = (
  <CookiesProvider>
    <BrowserRouter>
      <React.StrictMode>
        <Navbar />
        <Switch>
          <Route exact path="/" component={App} />
        </Switch>
        <Footer />
      </React.StrictMode>
    </BrowserRouter>
  </CookiesProvider>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
