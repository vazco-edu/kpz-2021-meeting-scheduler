import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Home from './Home';
import Footer from './components/Footer';
import Header from './components/Header';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';


const routing = (
  <BrowserRouter>
    <React.StrictMode>
      <Header />
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/home" component={Home} />
      </Switch>
      <Footer />
    </React.StrictMode>
  </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
