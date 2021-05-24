import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link, Route} from "react-router-dom";
import routes from '../routes';
import {Icon} from "@material-ui/core";


const createLinks = (routes: any[]) => {
    return routes.map((prop, key) => {
        if (prop.name) {
            return (
                <ListItem key={key} button component={Link} to={prop.layout + prop.path}>
                    <ListItemIcon>
                        <Icon component={prop.icon} />
                    </ListItemIcon>
                    <ListItemText primary={prop.name}/>
                </ListItem>
            );
        }
    })
}

export const mainListItems = (
    <div>
        {createLinks(routes)}
    </div>
);
