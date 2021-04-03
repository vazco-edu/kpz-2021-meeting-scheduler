import React from 'react';
import {GoogleForm} from "./GoogleLoginForm";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

export default function App() {
    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                </ul>

                <Switch>
                    <Route path="/about">
                        <About/>
                    </Route>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/home">
                        <Home/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

function Home() {
    return <h2>Home</h2>;
}

function About() {
    return <h2>About</h2>;
}

function Login() {
    return (
        <div>
            <h2>Login</h2>
            <GoogleForm/>
        </div>
    );
}
