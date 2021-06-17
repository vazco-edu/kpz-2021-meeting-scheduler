import React, {ChangeEvent} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Checkbox, Switch} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

interface MyProps {
    id: string | undefined,
    summary: string | undefined,
    description: string | undefined;
}

interface MyState {
    checked: boolean;
}

export default class CalendarCard extends React.Component<MyProps, MyState> {

    constructor(MyProps: MyProps | Readonly<MyProps>) {
        super(MyProps);
        this.state = {
            checked: true
        }
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event: ChangeEvent) {
        this.setState({checked: !this.state.checked});
    }

    render() {
        const useStyles = makeStyles({
            root: {
                minWidth: 275,
            },
            bullet: {
                display: 'inline-block',
                margin: '0 2px',
                transform: 'scale(0.8)',
            },
            title: {
                fontSize: 14,
            },
            pos: {
                marginBottom: 12,
            },
        });


        return (
            <Card className="minWidth: 275" variant="outlined" >
                <CardContent>
                    <Grid container spacing={5}>
                        <Grid item xs={10} md={10} lg={10}>
                            <Typography variant="h5" component="h2">
                                {this.props.summary}
                            </Typography>
                            <Typography  color="textSecondary">
                                {this.props.description}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} md={2} lg={2}>
                            <Checkbox id={this.props.id} onChange={this.handleChange}/>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}
