import { GoogleLogin } from 'react-google-login';
import React from "react";

const responseGoogle = (response) => {
    console.log(response)
}

export const GoogleForm = () => (
    <div>
        <h5>Google Login</h5>
        <GoogleLogin
            //Here you shall enter the Google OAuth API Key ;) Will work on some env variables later
            clientId="554233476862-r9gf09tip562md76upbuiv0mh6lro8mp.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
        />
    </div>
);