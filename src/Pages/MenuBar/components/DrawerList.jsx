import React from 'react';
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import {accountOptions} from "constants/menuOptions";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {path_list} from "../../../constants/routes";

const DrawerList = ({setRedirect, userContext, alertC}) => (
    <>
        <Divider />
        <List>
            {accountOptions.map((item, idx) => (
                <ListItem button key={idx} onClick={item?.path ? () => setRedirect(item.path) : async (e) => {
                    const message = await item.action(e, userContext?.token);
                    alertC.showAlert(message, "success");
                    userContext.logout();
                    setRedirect(path_list.LOGIN);
                }}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                </ListItem>
            ))}
        </List>
    </>
);

export default DrawerList;