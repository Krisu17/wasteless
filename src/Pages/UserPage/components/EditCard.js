import {Avatar, Button, Container, Icon, Modal, Paper, TextField} from "@material-ui/core";
import React, {useContext, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import {AlertContext, UserContext} from "../../../context";

const useStyles = makeStyles((theme) => ({
    mainDiv: {
        margin: theme.spacing(3),
        marginBottom: theme.spacing(8),
    },
    avatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        fontSize: "xxx-large"
    },
    profileDiv: {
        margin: theme.spacing(3),
        display: "flex",
        flexFlow: "row wrap",
    },
    avatarDiv: {
        display: "grid",
        flex: 1,
        // marginTop: theme.spacing(5),
        margin: theme.spacing(5),
        justifyContent: "center",
        height: "40%",
    },
    detailsDiv: {
        display: "grid",
        margin: theme.spacing(5),
        flex: 2
    },
    passwordDiv: {
        display: "grid",
        margin: theme.spacing(2),
        alignContent: "center",
        justifyContent: "center",
        width: "100%"
    },
    textField: {
        width: "100%",
        margin: theme.spacing(1)
    },
    editBtn: {
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        margin: theme.spacing(2),
    },
    submitBtn: {
        display: "grid",
        alignContent: "center",
        justifyContent: "right",
        marginTop: theme.spacing(2),
        width: "100%"
    },
    deleteBtn: {
        flex: 1,
        display: "grid",
        alignContent: "center",
        justifyContent: "right",
        marginTop: theme.spacing(2),
    },
    deleteDiv: {
        display: "flex"
    },
    deleteText: {
        alignContent: "center",
        justifyContent: "right",
        marginTop: theme.spacing(2),
        flex: 2
    },
    modalPaper: {
        position: 'absolute',
        width: "60%",
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: "25%",
        left: "35%",
        transform: `translate(-20%, -40%)`,
    },
    deleteTextField: {
        width: "100%"
    }
}))
const checkPasswordFormat = (body) => {
    const oldPass = body.old_password
    const newPass = body.new_password1
    const newPassR = body.new_password2

    if (oldPass.length < 8 || newPassR.length < 8 || newPass.length < 8 || !/^[a-zA-Z0-9!@#$%&*]+$/.test(oldPass) || !/^[a-zA-Z0-9!@#$%&*]+$/.test(newPass) || !/^[a-zA-Z0-9!@#$%&*]+$/.test(newPassR)) {
        throw "Wrong password format."
    }

    if (newPass !== newPassR) {
        throw "New password and repeat password must be the same."
    }

}

const changePassword = async (body, token) => {
    const url = "https://wasteless-backend.herokuapp.com/profile/changepassword";
    const headers = {
        "Content-Type": "application/json",
        Authorization: "Token " + token
    };

    const res = await fetch(url, {
        headers,
        method: "PUT",
        body: JSON.stringify(body),
    });

    if (res.status !== 200) {
        throw "Couldn't change your password. Make sure you put right old password."
    }
}

export default function EditCard() {
    const classes = useStyles();
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [newPassR, setNewPassR] = useState("")
    const alertC = useRef(useContext(AlertContext));
    const [open, setOpen] = React.useState(false);
    const user = useContext((UserContext))

    const handleSubmitPass = async (e) => {
        e.preventDefault()
        try {
            let body = {old_password: oldPass, new_password1: newPass, new_password2: newPassR}
            checkPasswordFormat(body)
            await changePassword(body, user.token)
            alertC.current.showAlert("Successfully changed password.", "success")
        } catch (err) {
            alertC.current.showAlert(err, "error")
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const body = (
        <div className={classes.modalPaper}>
            <h2 id="simple-modal-title">Are you sure you want to delete account?</h2>
            <p id="simple-modal-description">
                This action cannot be <b>undone</b>. This will permanently delete the <b>{user?.data?.username}</b> account.
            </p>

            <p id="simple-modal-description">
                Please type <b>{user?.data?.username}</b> to confirm.
            </p>
            <TextField label="Username" type="text" className={classes.deleteTextField}/>
            <div className={classes.deleteBtn}>
                <Button variant="contained" color="secondary">Delete</Button>
            </div>
        </div>
    );

    return (
        <Container fixed>
            <Paper>
                <div className={classes.mainDiv}>
                    <div className={classes.profileDiv}>
                        <div className={classes.avatarDiv}>
                            <div>
                                {user.avatarImg === "" ?
                                    <Avatar className={classes.avatar}>{user?.data?.name.charAt(0).toUpperCase()}</Avatar> :
                                    <Avatar className={classes.avatar} src={user?.data?.avatarImg}/>}
                            </div>
                            <div className={classes.editBtn}>
                                <Button size="small" variant="contained" endIcon={<EditIcon/>}>
                                    Edit
                                </Button>
                            </div>

                        </div>
                        <div className={classes.detailsDiv}>
                            <TextField className={classes.textField} label="Name" defaultValue={user?.data?.name}
                            />
                            <TextField className={classes.textField} label="Surname" defaultValue={user?.data?.surname}
                            />
                            <TextField className={classes.textField} label="Email" defaultValue={user?.data?.email}
                            />
                            <TextField className={classes.textField} label="Username"
                                       defaultValue={user?.data?.username}
                            />
                            <div className={classes.submitBtn}>
                                <Button variant="contained" color="primary" endIcon={<Icon>send</Icon>}>Submit</Button>
                            </div>
                            <h2>CHANGE PASSWORD</h2>
                            <TextField className={classes.textField} label="Current password" type="password"
                                       onChange={(e) => setOldPass(e.target.value)}/>
                            <TextField className={classes.textField} label="New password" type="password"
                                       onChange={(e) => setNewPass(e.target.value)}/>
                            <TextField className={classes.textField} label="Repeat password" type="password"
                                       onChange={(e) => setNewPassR(e.target.value)}/>
                            <div className={classes.submitBtn}>
                                <Button variant="contained" color="primary" endIcon={<Icon>send</Icon>}
                                        onClick={handleSubmitPass}>Submit</Button>
                            </div>
                            <h2>DELETE ACCOUNT</h2>
                            <div className={classes.deleteDiv}>
                                <div className={classes.deleteText}>
                                    <div><b>Delete account</b></div>
                                    <div>Once you do it, there is no going back</div>
                                </div>
                                <div className={classes.deleteBtn}>
                                    <Button variant="contained" color="secondary" onClick={handleOpen}>Delete</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </Container>
    )
}