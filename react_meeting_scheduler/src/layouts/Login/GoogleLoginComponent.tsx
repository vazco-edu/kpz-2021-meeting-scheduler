import React, {useState} from "react";
import {GoogleLogin} from "react-google-login";
import axios from "axios";
import CalendarFromResponse from "../../components/CalendarFromResponse";

const googleApiPublicKey: string = process.env.REACT_APP_GOOGLE_KEY + ""

interface GoogleButtonProps {
    parentCallback: any;
}

const GoogleForm: React.FC<GoogleButtonProps> = ({parentCallback}) => {
    const [isAuth, setAuth] = useState(false);

    const responseGoogle = (response: any) => {
        console.log(response)
    }

    const sendToken = async (profileInfo: any) => {
        console.log(profileInfo);

        try {

            let django = await axios.post(
                "http://127.0.0.1:8000/api/custom-tokens/",
                {
                    code: profileInfo.code,
                }
            )
            console.log(django.data);

            let res = await axios.post(
                "http://127.0.0.1:8000/dj-rest-auth/google/",
                {
                    access_token: django.data.access_token,
                    id_token: django.data.id_token,
                }
            );
            console.log(res.data);
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
            localStorage.setItem("google_refresh_token", django.data.refresh_token);
            localStorage.setItem("google_access_token", django.data.access_token)


            let calendars = await axios.post(
                "http://127.0.0.1:8000/api/calendars/list",
                {
                    access_token: localStorage.getItem("google_access_token") + "",
                    refresh_token: localStorage.getItem("google_refresh_token"),
                }
            ).then(calendars => {
                let calendarList: CalendarFromResponse[] = []
                for (let calendar of calendars.data) {
                    calendarList.push(new CalendarFromResponse(calendar.id, calendar.summary, calendar.description))
                }
                // ReactDOM.render(<CalendarForm calendarList={calendarList}/>
                // , document.getElementById('calendars'))
                localStorage.setItem("calendar", JSON.stringify(calendarList));
            })


            setAuth(true);
            parentCallback(true);

            return res;

        } catch (err) {
            console.log(err.message);

        }

    };


    return (
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
    )

};

export default GoogleForm;