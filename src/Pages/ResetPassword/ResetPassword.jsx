import React, {useContext, useEffect, useRef, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import PersonIcon from '@material-ui/icons/Person';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from "@material-ui/core/Card";
import {Redirect, useParams} from "react-router-dom";
import {path_list as paths_list, path_list} from "constants/routes";
import {AlertContext} from "context/AlertContext";
import {getCORSHeaders} from "../../utils/fetchTools";
import {be} from "../../constants/backendSetup";
import CircularProgress from "@material-ui/core/CircularProgress";
import LockOpenIcon from '@material-ui/icons/LockOpen';

const validatePassword = (password) => {
    if (password.length < 8 || !/^[a-zA-Z0-9!@#$%&*]+$/.test(password)) {
        throw "Password must be at least 8 characters long and contain only letters, numbers, and !/@/#/$/%/&/* characters."
    }
}


function validateInput(password, repeatPassword) {
    if (password !== repeatPassword) {
        throw "Passwords are not identical"
    }
    try {
        validatePassword(password);
    } catch (e) {
        throw e;
    }

}

const resetPassword = async (data) => {
    const url = `${be.RESET_PASSWORD}`;
    const headers = getCORSHeaders()

    const res = await fetch(url, {
        headers,
        method: "POST",
        body: JSON.stringify(data)
    });

    if (res.status === 200) {
        return await res.json();
    } else {
        let response = await res.text();
        console.log(response);

        throw "An unexpected error occured"
    }
}


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
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
        paddingLeft: '7%',
        paddingRight: '7%',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    card: {
        boxShadow: '0 1px 1px 1px lightblue',
        marginTop: theme.spacing(5),
    },
    centered: {
        justifyContent: 'center',
        textAlign: 'center',
    },
    text: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        marginTop: theme.spacing(3),
        textAlign: "justify",
        textIndent: "20px"
    },
}));

export default function ResetPassword() {
    const classes = useStyles();
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [redirect, setRedirect] = useState(undefined);
    const [disabled, setDisabled] = useState(false);
    const [validated, setValidated] = useState("false");
    const alertC = useRef(useContext(AlertContext));
    const {reset_token} = useParams();
    const resetToken = reset_token;
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const validateToken = async (resetToken) => {
            setLoading(true);
            try {
                let res = await fetchValidateToken(resetToken);
            } catch (e) {
                alertC.current.showAlert("Wrong address, redirecting to dashboard...", "error");
                setRedirect(paths_list.DASHBOARD.route);
            } finally {
                setLoading(false);
            }
        };
        validateToken(resetToken);
    }, [reset_token]);


    const fetchValidateToken = async (resetToken) => {
        const url = `${be.VALIDATE_RESET_TOKEN}`;
        const headers = getCORSHeaders()

        const res = await fetch(url, {
            headers,
            method: "POST",
            body: JSON.stringify({
                "token": resetToken,
            })
        });

        if (res.status === 200) {
            setIsTokenValid(true);
        } else {
            setIsTokenValid(false);
            throw res.body;
        }
        return isTokenValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            validateInput(password, repeatPassword);
            try {
                let res = await resetPassword({"password": password, "token": resetToken});
                alertC.current.showAlert("Password changed successfully!", "success");
                setRedirect(path_list.LOGIN.route);
            } catch (e) {
                alertC.current.showAlert("Something went wrong while trying to reset password. Try generate new reset link", "error");
            } finally {

            }
        } catch (e) {
            alertC.current.showAlert(e, "error");
        }

    };

    return (
        <Container component="main" maxWidth="xs">
            {
                loading ? (
                    <div className={classes.centered}>
                        <CircularProgress/>
                    </div>
                ) : (
                    isTokenValid ? (
                        <Card className={classes.card}>
                            <CssBaseline/>
                            <div className={classes.paper}>
                                <Avatar className={classes.avatar}>
                                    <LockOpenIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Reset your password
                                </Typography>
                                <Card className={classes.text}>
                                    <p className={classes.text}>
                                        Please type and retype your password. Make sure your new password meets our secure standard (one lower and uppercase, one digit and one special character). And make sure to write it down somewhere ;)
                                    </p>
                                </Card>
                                <form className={classes.form} noValidate validated={validated} onSubmit={handleSubmit}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="repeat_password"
                                        label="Repeat password"
                                        type="password"
                                        id="repeat_password"
                                        autoComplete="repeat-password"
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
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
                                        {disabled ? "Loading..." : "Reset password"}
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    ) : (
                        <div>
                            {redirect && <Redirect to={redirect}/>}
                        </div>

                    )
                )}
        </Container>
    );
};
