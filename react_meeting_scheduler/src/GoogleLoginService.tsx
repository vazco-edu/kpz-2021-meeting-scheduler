import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import CalendarCard from "./components/CalendarCard";
import CalendarForm from "./components/CalendarForm";
import CalendarFromResponse from "./components/CalendarFromResponse";
import Calendar from "./components/CalendarFromResponse";

const sendToken = async(profileInfo : any) => {
    console.log(profileInfo);

    try{
        
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
                access_token: localStorage.getItem("google_access_token")+"",
                refresh_token: localStorage.getItem("google_refresh_token"),
            }
        ).then(calendars => {
            // let calendarForm = []
            // for (let calendar of calendars.data) {
            //     calendarForm.push(<CalendarCard id={calendar.id} summary={calendar.summary}  description={calendar.description}/>)
            // }
            // const submitButton = <input type={onsubmit()} value="Send"></input>
            // calendarForm.push(submitButton)
            // ReactDOM.render(calendarForm, document.getElementById('calendars'))
            console.log(calendars.data)
            let calendarList: CalendarCard[] | any = []
            for (let calendar of calendars.data) {

                calendarList.push(<CalendarCard id={calendar.id} summary={calendar.summary} description={calendar.description} />)
            }

            ReactDOM.render(<CalendarForm calendarList={calendarList}/>
            , document.getElementById('calendars'))
        })



        return res;
        
    } catch(err){
        console.log(err.message);
        
    }

};

export default sendToken;