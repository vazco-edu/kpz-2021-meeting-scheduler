import React, {ChangeEvent} from "react";
import CalendarCard from "./CalendarCard";
import CalendarFromResponse from "./CalendarFromResponse";
import axios from "axios";
import {Redirect} from "react-router-dom";

interface MyState {
    calendarsChecked: string[];
    beginning_date: any;
    ending_date: any;
    beginning_time: any;
    ending_time: any;
    duration: any;
    isSubmitted: boolean;
}
interface IRequestData {
    calendars: string[];
    "beginning_date": string,
    "ending_date": string,
    "beginning_hours": string,
    "beginning_minutes": string,
    "ending_hours": string,
    "ending_minutes": string,
    "meeting_duration_hours": string,
    "meeting_duration_minutes": string,
}

interface IResponseData {
    calendars: string[];
    dates: Date[];
    duration_hours: number;
    duration_minutes: number;
}

export default class CalendarForm extends React.Component<any , MyState> {
    calendarList: CalendarFromResponse[] ;
    constructor(props: any) {
        super(props);
        this.state = {
            calendarsChecked: [] = [],
            beginning_date: null,
            ending_date: null,
            beginning_time: null,
            ending_time: null,
            duration: null,
            isSubmitted: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    handleChange(event: React.ChangeEvent<HTMLInputElement> | any) {
        if(event.target.type != 'checkbox'){
            this.setState({ [event.target.id]: event.target.value || ''} as Pick<MyState, any>);
        }
        if (event.target.checked == true && this.state.calendarsChecked.indexOf(event.target.id) == -1) {
            this.state.calendarsChecked.push(event.target.id)
        } else {
            let index = this.state.calendarsChecked.indexOf(event.target.id)
            if (index !== -1) {
                this.state.calendarsChecked.splice(index, 1);
            }
        }
    }

    handleSubmit(event: React.ChangeEvent<HTMLInputElement> | any) {
        this.setState({
            isSubmitted: true
        })
        console.log(this.state.isSubmitted)
        let [beginning_hours, beginning_minutes] = this.state.beginning_time.split(':').
        map((element: string) => parseInt(element))
        let [ending_hours, ending_minutes] = this.state.ending_time.split(':').
        map((element: string) => parseInt(element))
        let [meeting_duration_hours, meeting_duration_minutes] = this.state.duration.split(':').
        map((element: string) => parseInt(element))

        let body = {} as IRequestData;
        body.calendars = this.state.calendarsChecked
        body.beginning_date = this.state.beginning_date
        body.ending_date = this.state.ending_date
        body.beginning_hours = beginning_hours
        body.beginning_minutes = beginning_minutes
        body.ending_hours = ending_hours
        body.ending_minutes = ending_minutes
        body.meeting_duration_hours = meeting_duration_hours
        body.meeting_duration_minutes = meeting_duration_minutes

        axios.post(
            "http://localhost:8000/api/calendars/algorithm",
            {
                body
            }
        ).then(response => {
            let responseData = response as unknown as IResponseData
            localStorage.setItem("dates", JSON.stringify(responseData.dates));
            localStorage.setItem("calendars", JSON.stringify(responseData.calendars));
            localStorage.setItem("duration_hours", JSON.stringify(responseData.duration_hours));
            localStorage.setItem("duration_minutes", JSON.stringify(responseData.duration_minutes));
            localStorage.setItem("duration_minutes", JSON.stringify(responseData.duration_minutes));
        })
    }



    render() {
        if(this.state.isSubmitted){
            return <Redirect to='events'/>
        }

        this.calendarList = JSON.parse(localStorage.getItem("calendar")) as CalendarFromResponse[];
        return (
            <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                {this.calendarList != null ? this.calendarList.map(calendar => <CalendarCard id={calendar.id} summary={calendar.summary}
                                                                                             description={calendar.description}/>) : console.log("Empty calendar list!")}
                <label htmlFor="beginning_date"> Beginning date: </label>
                <input type="date" id="beginning_date" value={this.state.beginning_date} required={true}/>
                <label htmlFor="ending_date"> Ending date: </label>
                <input type="date" id="ending_date" value={this.state.ending_date} required={true}/>
                <label htmlFor="beginning_time"> Beginning hour and minute: </label>
                <input type="time" id="beginning_time" value={this.state.beginning_time} required={true}/>
                <label htmlFor="ending_time"> Ending hour and minute: </label>
                <input type="time" id="ending_time" value={this.state.ending_time} required={true}/>
                <label htmlFor="duration"> Meeting duration time: </label>
                <input type="time" id="duration" value={this.state.duration} required={true}/>
                <input type="submit" value="Send"/>

            </form>
        );
    }
}
