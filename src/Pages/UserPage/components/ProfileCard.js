import {Avatar, Container, Paper, TextField} from "@material-ui/core";
import React, {useContext} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {UserContext} from "../../../context";

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        fontSize: "xxx-large"
    },
    profileDiv: {
        margin: theme.spacing(3),
        display: "flex",
        flexFlow: "row wrap",
        marginBottom: theme.spacing(8),
    },
    avatarDiv: {
        display: "grid",
        flex: 1,
        margin: theme.spacing(5),
        justifyContent: "center"
    },
    detailsDiv: {
        display: "grid",
        margin: theme.spacing(5),
        flex: 2
    },
    textField: {
        width: "80%",
        margin: theme.spacing(1)
    },
}));

export default function ProfileCard() {
    const classes = useStyles();
    const user = useContext((UserContext))

    return (<Container fixed>
        <Paper>
            <div className={classes.profileDiv}>
                <div className={classes.avatarDiv}>
                    {user.avatarImg === "" ?
                        <Avatar className={classes.avatar}>{user?.data?.name.charAt(0).toUpperCase()}</Avatar> :
                        <Avatar className={classes.avatar} src={user?.data?.avatarImg}/>}
                </div>
                <form className={classes.detailsDiv}>
                    <TextField className={classes.textField} label="Username"
                               defaultValue={user?.data?.username}
                               disabled/>
                    <TextField className={classes.textField} label="Name" defaultValue={user?.data?.first_name}
                               disabled/>
                    <TextField className={classes.textField} label="Surname" defaultValue={user?.data?.last_name}
                               disabled/>
                    <TextField className={classes.textField} label="Email" defaultValue={user?.data?.email}
                               disabled/>
                </form>
            </div>
        </Paper>
    </Container>)
}