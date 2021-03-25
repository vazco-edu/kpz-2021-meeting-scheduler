import React from 'react';
import { Task } from './Task';
import { GoogleLogin } from 'react-google-login';
import { useGoogleLogout } from 'react-google-login'
import { useGoogleLogin } from 'react-google-login'

const tasks = [
    {_id: 1, text: 'First Task'},
    {_id: 2, text: 'Second Task'},
    {_id: 3, text: 'Third Task'},
];

const responseGoogle = (response) => {
    console.log(response);
}

export const App = () => (
    <div>
        <h1>Welcome to Meteor!</h1>
        <h5>Google Login</h5>
        <GoogleLogin
            clientId="" //Here you shall enter the Google OAuth API Key ;) Will work on some env variable later
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            // isSignedIn={true}
            cookiePolicy={'single_host_origin'}
        />
        <ul>
            { tasks.map(task => <Task key={ task._id } task={ task }/>) }
        </ul>
    </div>
);
