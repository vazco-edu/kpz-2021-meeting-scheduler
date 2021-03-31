import {GoogleLogin} from 'react-google-login';
import React from "react";
import {Meteor} from 'meteor/meteor';

let googleApiPublicKey = Meteor.settings.public.googleApiPublicKey;

const responseGoogle = (response) => {
    console.log(googleApiPublicKey)
    console.log(response)
}

export const GoogleForm = () => (
    <div>
        <h5>Google Login</h5>
        <GoogleLogin
            //Here you shall enter the Google OAuth API Key ;) Will work on some env variables later
            clientId={googleApiPublicKey}
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
            scope={" https://www.googleapis.com/auth/calendar.calendarlist.readonly" +
            " https://www.googleapis.com/auth/calendar.app.created" +
            " https://www.googleapis.com/auth/calendar.events.freebusy" +
            " https://www.googleapis.com/auth/calendar.events.public.readonly" +
            " https://www.googleapis.com/auth/calendar.freebusy" +
            " https://www.googleapis.com/auth/calendar.settings.readonly" +
            " https://www.googleapis.com/auth/calendar" +
            " https://www.googleapis.com/auth/calendar.readonly" +
            " https://www.googleapis.com/auth/calendar.events" +
            " https://www.googleapis.com/auth/calendar.events.owned" +
            " https://www.googleapis.com/auth/calendar.events.owned.readonly" +
            " https://www.googleapis.com/auth/calendar.events.readonly" +
            " https://www.googleapis.com/auth/calendar.calendarlist" +
            " https://www.googleapis.com/auth/calendar.calendars" +
            " https://www.googleapis.com/auth/calendar.calendars.readonly" +
            " https://www.googleapis.com/auth/calendar.acls"}
        />
    </div>

);