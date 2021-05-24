import React from "react";
import {GoogleLogin} from "react-google-login";
import sendToken from "../../services/GoogleLoginService"

const googleApiPublicKey: string = process.env.REACT_APP_GOOGLE_KEY+""
interface GoogleButtonProps {
    
}


const responseGoogle = (response: any) => {
    console.log(response)
}


const GoogleForm: React.FC<GoogleButtonProps> = () => (
    <div>
        <GoogleLogin
            //Here you shall enter the Google OAuth API Key ;) Will work on some env variables later
            clientId={googleApiPublicKey}
            buttonText="Login with Google"
            onSuccess={sendToken}
            onFailure={responseGoogle}
            cookiePolicy={"none"}
            responseType={"code"}
            accessType={'offline'}
            
            prompt={'consent'} 
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

export default GoogleForm;