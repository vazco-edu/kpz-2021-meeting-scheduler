import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useLocation, Redirect } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import GoogleForm from "./GoogleLoginComponent";
import Copyright from "../../components/Copyright";


const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(/media/login-bg.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const LoginPage = () => {
    const classes = useStyles();
    const location = useLocation();
    const [isAuthorized, setAuthorized] = useState(false);

    let callback = (isAuth: boolean) => {
        setAuthorized(isAuth);
    }
    console.log(isAuthorized)

    if(isAuthorized){
        return (
            <Redirect to='/home'/>
        )
    }
    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline/>
            <Grid item xs={false} sm={4} md={7} className={classes.image}/>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Box mb={5}>
                        <Typography component="h1" variant="h3">
                            Meeting Scheduler
                        </Typography>
                    </Box>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        <Box mb={5}>
                            Sign in
                        </Box>
                    </Typography>

                    <GoogleForm parentCallback={callback}/>

                    <Box mt={5}>
                        <Copyright/>
                    </Box>
                </div>
            </Grid>
        </Grid>
    );
}

export default LoginPage;