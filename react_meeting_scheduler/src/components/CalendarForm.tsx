import React, {ChangeEvent} from "react";
import CalendarCard from "./CalendarCard";
import CalendarFromResponse from "./CalendarFromResponse";
import axios from "axios";

interface MyProps {
    calendarList: CalendarFromResponse[];
}

interface MyState {
    calendarsChecked: string[];
}

export default class CalendarForm extends React.Component<MyProps, MyState> {
    constructor(props: MyProps | Readonly<MyProps>) {
        super(props);
        this.state = {
            calendarsChecked: [] = []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    handleChange(event: React.ChangeEvent<HTMLInputElement> | any) {
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
        const apiUrl = 'http://127.0.0.1:8000/api/aaaaaaaa';
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => console.log(data));

        let body = JSON.stringify(this.state.calendarsChecked)
        console.log(body)
        axios.post(
            "http://zajonc.com",
            {
                body
            }
        ).then(response => {
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                {this.props.calendarList.map(calendar => <CalendarCard id={calendar.id} summary={calendar.summary}
                                                                       description={calendar.description}/>)}
                <input type="submit" value="Send"/>
            </form>
        );
    }
}
