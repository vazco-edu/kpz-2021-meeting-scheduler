import React, {ChangeEvent} from "react";
import CalendarCard from "./CalendarCard";
import CalendarFromResponse from "./CalendarFromResponse";
import axios from "axios";
import {Redirect} from "react-router-dom";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Copyright from "./Copyright";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

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
    calendars: string[],
    "beginning_date": string,
    "ending_date": string,
    "beginning_hours": string,
    "beginning_minutes": string,
    "ending_hours": string,
    "ending_minutes": string,
    "meeting_duration_hours": string,
    "meeting_duration_minutes": string,
    "refresh_token": string,
    "access_token": string
 }

interface IResponseData {
    data: any;
    calendars: string[];
    dates: string[];
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

    async handleSubmit(event: React.ChangeEvent<HTMLInputElement> | any) {
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
        body.access_token = localStorage.getItem("google_access_token")
        body.refresh_token = localStorage.getItem("google_refresh_token")

        let a = await axios.post(
            "http://localhost:8000/api/calendars/algorithm", body
        )

        let responseData = a as unknown as IResponseData
        console.log(responseData);
        localStorage.setItem("dates", JSON.stringify(responseData.data.dates));
        localStorage.setItem("calendars", JSON.stringify(responseData.data.calendars));
        localStorage.setItem("duration_hours", JSON.stringify(responseData.data.duration_hours));
        localStorage.setItem("duration_minutes", JSON.stringify(responseData.data.duration_minutes));
    }

    render() {
        if(this.state.isSubmitted){
            return <Redirect to='schedule'/>
        }

        this.calendarList = JSON.parse(localStorage.getItem("calendar")) as CalendarFromResponse[];
        return (
        <Container maxWidth="md">
            <Box my={5}>
                <Card className="minWidth: 275" variant="outlined">
                    <CardContent>

                        <Box mt={5}>
                            <Typography variant="h5" component="h2">
                                Schedule a new event
                            </Typography>
                        </Box>
                        <Box mt={1}>
                            <Typography className="marginBottom: 12" color="textSecondary">
                                Complete the information below and schedule your event by clicking the "Create"
                                button.
                            </Typography>
                        </Box>
                        <Box my={5} >
                            <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                                {this.calendarList != null ? this.calendarList.map(calendar => <CalendarCard id={calendar.id} summary={calendar.summary}
                                                                                                             description={calendar.description}/>) : console.log("Empty calendar list!")}
                                <Grid container spacing={5}>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Box mt={3}>
                                            <TextField
                                                fullWidth={true}
                                                id="beginning_date"
                                                label="Beginning date:"
                                                type="date"
                                                value={this.state.beginning_date}
                                                required={true}
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Box mt={3}>
                                            <TextField
                                                fullWidth={true}
                                                id="ending_date"
                                                label="Ending date:"
                                                type="date"
                                                value={this.state.ending_date}
                                                required={true}
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={5}>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Box mt={3}>
                                            <TextField
                                                fullWidth={true}
                                                id="beginning_time"
                                                label="Beginning hour and minute:"
                                                type="time"
                                                value={this.state.beginning_time}
                                                required={true}
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Box mt={3}>
                                            <TextField
                                                fullWidth={true}
                                                id="ending_time"
                                                label="Ending hour and minute:"
                                                type="time"
                                                value={this.state.ending_time}
                                                required={true}
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Box mt={3}>
                                    <TextField
                                        fullWidth={true}
                                        id="duration"
                                        label="Meeting duration time:"
                                        type="time"
                                        value={this.state.duration}
                                        required={true}
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                    />
                                </Box>
                                <Box mt={3}  textAlign={"center"}>
                                    <Button type={"submit"} size="large" color="primary" variant="contained">Search</Button>
                                </Box>

                            </form>
                        </Box>
                    </CardContent>
                </Card>
                <Box pt={4}>
                    <Copyright/>
                </Box>
            </Box>
        </Container>
        );
    }
}
