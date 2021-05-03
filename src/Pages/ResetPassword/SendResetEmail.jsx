import React, {useContext, useState, useRef} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from "@material-ui/core/Card";
import {be} from "constants/backendSetup.js";
import {getCORSHeaders} from "utils/fetchTools";
import {Redirect} from "react-router-dom";
import {path_list as paths_list} from "constants/routes";
import {AlertContext} from "context/AlertContext";


const requestSendingEmail = async (data) => {
    let url = `${be.REQUEST_RESET_EMAIL}`;
    let headers = getCORSHeaders();

    let res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
            "email": data.email,
        })
    });
    if (res.status === 200 || res.status === 201) {
        return await res.json();
    } else {
        throw res.status;
    }
};


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        padding: '7%'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    card: {
        boxShadow: '0 1px 1px 1px lightblue',
        marginTop: theme.spacing(5),
    },
}));

export default function SendResetEmail() {

    const [data, setData] = useState({
        email: "",
    });
    const classes = useStyles();
    const [disabled, setDisabled] = useState(false);
    const [validated, setValidated] = useState("false");
    const [redirect, setRedirect] = useState(undefined);
    const alertC = useRef(useContext(AlertContext));

    const submitForm = async (e) => {
        e.preventDefault();
        setValidated("true");
        if (e.currentTarget.checkValidity() === false) {
            e.stopPropagation();
        } else {
            setDisabled(true);
            try {
                await requestSendingEmail(data);
                alertC.current.showAlert("If given address is correct, reset email have been sent to your mailbox", "success");
                setRedirect(paths_list.LOGIN.route);
            } catch(e) {
                console.log(e);
                alertC.current.showAlert("Wrong email format", "error");
            } finally {
                setDisabled(false);
            }
        }
    }


    return (
        <Container component="main" maxWidth="xs">
            <Card className={classes.card}>
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Send reset email
                    </Typography>
                    <form className={classes.form} noValidate validated={validated} onSubmit={submitForm}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={data.email}
                            onChange={e => setData({...data, email: e.target.value})}
                        />
                        {redirect && <Redirect to={redirect}/>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={disabled}
                        >
                            {disabled ? "Loading..." : "Send reset email"}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link variant="body2" onClick={() => setRedirect(paths_list.LOGIN.route)}>
                                    Login page
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link variant="body2" onClick={() => setRedirect(paths_list.REGISTER.route)}>
                                    Don't have an account? Sign Up
                                </Link>

                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Card>
        </Container>
    );
}
