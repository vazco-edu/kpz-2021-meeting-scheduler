import { GoogleLogin } from 'react-google-login';
import React from "react";

const responseGoogle = (response) => {
    console.log(response.profileObj)
}

const scopes = 'https://www.googleapis.com/auth/calendar.readonly '
export const GoogleForm = () => (
    <div>
        <h5>Google Login</h5>
        <GoogleLogin
            //Here you shall enter the Google OAuth API Key ;) Will work on some env variables later
            clientId=""
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
            theme={"dark"}
            scope="aa"
        />
    </div>

);