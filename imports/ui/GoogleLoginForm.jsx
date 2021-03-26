import { GoogleLogin } from 'react-google-login';
import React from "react";

const responseGoogle = (response) => {
    console.log(response.profileObj)
}

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
            scope={"https://www.googleapis.com/auth/userinfo.email" +
            " https://www.googleapis.com/auth/userinfo.profile" +
            " https://www.googleapis.com/auth/calendar.calendarlist.readonly" +
            " https://www.googleapis.com/auth/calendar.app.created" +
            " https://www.googleapis.com/auth/calendar.events.freebusy" +
            " https://www.googleapis.com/auth/calendar.events.public.readonly" +
            " https://www.googleapis.com/auth/calendar" +
            " https://www.googleapis.com/auth/calendar.readonly" +
            " https://www.googleapis.com/auth/calendar.events" +
            " https://www.googleapis.com/auth/calendar.events.owned" +
            " https://www.googleapis.com/auth/calendar.events.owned.readonly" +
            " https://www.googleapis.com/auth/calendar.events.readonly" +
            " https://www.googleapis.com/auth/calendar.calendarlist" +
            " https://www.googleapis.com/auth/calendar.calendars" +
            " https://www.googleapis.com/auth/calendar.calendars.readonly"}
        />
    </div>

);