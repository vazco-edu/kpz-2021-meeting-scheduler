import React from "react";

// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Copyright from "../../components/Copyright";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));


const Profile = () => {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper className={fixedHeightPaper}>
                            PROFILE
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>

                        <Paper className={fixedHeightPaper}>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                        </Paper>
                    </Grid>
                </Grid>
                <Box pt={4}>
                    <Copyright/>
                </Box>
            </Container>
        </>
    );
};

export default Profile;
