import {path_list} from "./routes";
import HowToRegIcon from '@material-ui/icons/HowToReg';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import KitchenIcon from '@material-ui/icons/Kitchen';
import React from "react";
import {handleLogout} from "Pages/MenuBar/components/Logout";
import DashboardIcon from '@material-ui/icons/Dashboard';
import PostAddIcon from '@material-ui/icons/PostAdd';

export const mainOptions = [
    {
        name: "My fridges",
        icon: <KitchenIcon />,
        path: path_list.FRIDGE_LIST,
        requiresLogin: true,
    },
    {
        name: "Recipes",
        icon: <DashboardIcon />,
        path: path_list.RECIPES_LIST,
        requiresLogin: true,
    },
    {
        name: "Add new recipe",
        icon: <PostAddIcon />,
        path: path_list.NEW_RECIPE,
        requiresLogin: true,
    },
];

export const accountOptions = [
    {
        name: "My profile",
        icon: <AccountCircleIcon />,
        path: path_list.PROFILE,
        requiresLogin: true
    },
    {
        name: "Register",
        icon: <HowToRegIcon />,
        path: path_list.REGISTER,
        requiresLogin: false
    },
    {
        name: "Log in",
        icon: <ExitToAppIcon />,
        path: path_list.LOGIN,
        requiresLogin: false
    },
    {
        name: "Log out",
        icon: <ExitToAppIcon/>,
        action: (e, token) => handleLogout(e, token),
        requiresLogin: true
    }
];