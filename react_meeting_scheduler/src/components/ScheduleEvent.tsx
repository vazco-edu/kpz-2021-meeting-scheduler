import React from "react";
import CalendarFromResponse from "./CalendarFromResponse";
import {Hidden, MenuItem, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import axios from "axios";
import {Redirect} from "react-router-dom";


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
    calendarList: CalendarFromResponse[];

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
        if(event.target.type != 'checkbox'){
            this.setState({ [event.target.id]: event.target.value || ''} as Pick<MyState, any>);
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
                   body,{
            }
        ).then((response) => {
          alert("Wszystko ok!")
            console.log(response)
        }, (error) => {
          alert("coś poszło nie tak, spróbuj jeszcze raz!")
        });

        event.preventDefault();
    }


    render() {
        this.calendarList = JSON.parse(localStorage.getItem("calendar")) as CalendarFromResponse[];
        // const theme = useTheme();
        // const classes = useTheme();

          const handleChange = (event: { target: { value: any; }; }) => {
            this.setState({"date": event.target.value});
          };
        return (
            // <ScheduleEventForm/>

            <Card className="minWidth: 275" variant="outlined">
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Utwórz nowe wydarzenie
                    </Typography>
                    <Typography className="marginBottom: 12" color="textSecondary">
                        Uzupełnij poniższe informacje i utwórz wydarzenie klikając "Utwórz"
                    </Typography>
                    <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                        <TextField id="title" label="Title"/>
                        <TextField
                            id="description"
                            label="Description"
                            multiline
                        />
                        <TextField
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

                        <input type="submit" value="Send"/>
                    </form>
                </CardContent>
                <CardActions>

                </CardActions>
            </Card>
        );
    }
}
