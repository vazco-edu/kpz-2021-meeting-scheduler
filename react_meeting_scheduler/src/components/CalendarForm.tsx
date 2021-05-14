import React from "react";
import CalendarCard from "./CalendarCard";

interface MyProps {
    calendarList: CalendarCard[];
}


export default class CalendarForm extends React.Component<MyProps>  {
    constructor(props: MyProps | Readonly<MyProps>) {
        super(props);
        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    handleSubmit(event: React.ChangeEvent<HTMLInputElement> | any) {
        this.props.calendarList.forEach(calendar => {
            console.log(this.props.calendarList)
            console.log(calendar.state.checked)
            if(calendar.state.checked){
                console.log(calendar.props.id)
            }
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {this.props.calendarList}
                <input type="submit" value="Send" />
            </form>
        );
    }
}
