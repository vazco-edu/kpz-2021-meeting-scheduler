import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Navbar from '../../components/Navbar';
import {Redirect, Route, Switch, useLocation} from "react-router-dom";
import routes from '../../routes';


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

const Dashboard = () => {
    const classes = useStyles();
    const location = useLocation();

    React.useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, [location]);

    const getRoutes = (routes: any[]) => {
        return routes.map((prop, key) => {
            if (prop.layout === "/dashboard") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };

    const getBrandText = (pathname: string) => {
        for (let i = 0; i < routes.length; i++) {
            if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
                return routes[i].name;
            }
        }
        return "Brand";
    };

    return (
        <div className={classes.root}>
            <Navbar/>
            <Box className={classes.content}>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer}/>
                    <Box>
                        {getBrandText(location.pathname)};
                    </Box>
                    <Switch>
                        {getRoutes(routes)}
                        <Redirect from="*" to="/dashboard/"/>
                    </Switch>
                </main>
            </Box>
        </div>
    );
}

export default Dashboard;
