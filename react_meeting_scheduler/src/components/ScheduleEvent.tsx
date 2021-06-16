import React from "react";
import {MenuItem, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Copyright from "./Copyright";
import Button from "@material-ui/core/Button";


interface MyState {
    date: string;
    title: string;
    description: string
}

const dates = [
    {
        value: '2021-06-15 15:00:00.000000Z',
        label: '2021-06-15 15:00',
    },
    {
        value: '2021-06-15 15:15:00.000000Z',
        label: '2021-06-15 15:15',
    },
    {
        value: '2021-06-15 15:30:00.000000Z',
        label: '2021-06-15 15:30',
    },
    {
        value: '2021-06-15 15:45:00.000000Z',
        label: '2021-06-15 15:45',
    },
];

interface IRequestData {
    "calendars": string;
    "access_token": string;
    "refresh_token": string;
    "date": string;
    "duration_hours": string;
    "duration_minutes": string;
    "description": string;
    "title": string;
}

export default class ScheduleEvent extends React.Component<any, MyState> {
    constructor(props: any) {
        super(props);
        this.state = {
            date: dates[0].value,
            title: null,
            description: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    handleChange(event: React.ChangeEvent<HTMLInputElement> | any) {
        if (event.target.type != 'checkbox') {
            this.setState({[event.target.id]: event.target.value || ''} as Pick<MyState, any>);
        }
    }

    handleSubmit(event: React.ChangeEvent<HTMLInputElement> | any) {
        let body = {} as IRequestData;
        body.calendars = localStorage.getItem('calendars');
        body.access_token = localStorage.getItem('google_access_token');
        body.refresh_token = localStorage.getItem('google_refresh_token');
        body.date = this.state.date;
        body.duration_hours = localStorage.getItem('duration_hours');
        body.duration_minutes = localStorage.getItem('duration_minutes');
        body.title = this.state.title;
        body.description = this.state.description;

        axios.post(
            "http://localhost:8000/api/calendars/insert",
            body, {}
        ).then((response) => {
            alert("Wszystko ok!")
            console.log(response)
        }, (error) => {
            alert("coś poszło nie tak, spróbuj jeszcze raz!")
        });

        event.preventDefault();
    }


    render() {

        const handleChange = (event: { target: { value: any; }; }) => {
            this.setState({"date": event.target.value});
        };
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
                            <Box my={5}>
                                <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                                    <Box mt={3}>
                                        <TextField fullWidth={true} id="title" label="Title"/>
                                    </Box>
                                    <Box mt={3}>
                                        <TextField
                                            id="description"
                                            label="Description"
                                            multiline
                                            fullWidth={true}
                                        />
                                    </Box>

                                    <Box mt={4}>
                                        <TextField
                                            fullWidth={true}
                                            id="dates"
                                            select
                                            label="Event start date"
                                            value={this.state.date}
                                            onChange={handleChange}
                                            helperText="Please select one of following dates"
                                        >
                                            {dates.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                    <Box mt={3}  textAlign={"center"}>
                                        <Button type={"submit"} size="large" color="primary" variant="contained">Create</Button>
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
