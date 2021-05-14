import React, {ChangeEvent} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Checkbox} from "@material-ui/core";

interface MyProps {
    id: string,
    summary: string,
    description: string;
}

interface MyState {
    checked: boolean;
}

export default class CalendarCard extends React.Component<MyProps, MyState>  {

    constructor(MyProps: MyProps | Readonly<MyProps>) {
        super(MyProps);
        this.state = {checked: true}
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event: ChangeEvent) {
        this.setState({checked: !this.state.checked});
        console.log(this.state.checked)
    }

    render(){
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
            <Card className="minWidth: 275" variant="outlined">
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {this.props.summary}
                    </Typography>
                    <Typography className="marginBottom: 12" color="textSecondary">
                        {this.props.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Checkbox id={this.props.id} onChange={this.handleChange}/>
                </CardActions>
            </Card>
        );
    }
}
