import React, {useContext, useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import {AlertContext, UserContext} from "../../context";
import fridgeImage from '../../assets/fridge.svg'
import CircularProgress from '@material-ui/core/CircularProgress';
import {Redirect} from 'react-router-dom';
import {path_list} from "../../constants/routes";
import {getCORSHeaders} from "../../utils/fetchTools";
import {be} from "../../constants/backendSetup";

const fetchFridgesList = async (token) => {
    const url = be.PROFILE + 'fridges/';
    const headers = getCORSHeaders(token)

    const res = await fetch(url, {
        headers,
        method: "GET"
    });

    if (res.status === 200) {
        return await res.json();
    } else {
        throw res.status
    }
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        minWidth: 200,
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center',
        },
    },
    image: {
        position: 'relative',
        margin: '1%',
        height: 500,
        width: '30%',
        [theme.breakpoints.down('xs')]: {
            width: '65% !important', // Overrides inline-style
            height: 300,
        },
        '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.15,
            },
            '& $imageMarked': {
                opacity: 0,
            },
            '& $imageTitle': {
                border: '4px solid currentColor',
            },
        },
    },
    focusVisible: {},
    imageButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    },
    imageSrc: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.0,
        transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
        position: 'relative',
        padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
    },
    imageMarked: {
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    },
}));

export default function FridgesList() {
    const classes = useStyles();

    const alertC = useRef(useContext(AlertContext));
    const user = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [fridges, setFridges] = useState([]);
    const [redirect, setRedirect] = useState(undefined);

    useEffect(() => {
        const loadFridges = async (token) => {
            setLoading(true);
            try {
                let fridges = await fetchFridgesList(token);
                setFridges(fridges);
            } catch (e) {
                alertC.current.showAlert("Couldn't load fridge list!", "error")
            } finally {
                setLoading(false)
            }
        };
        loadFridges(user.token);
    }, [user.token]);

    return (
        <div className={classes.root}>
            {
                loading ? (
                    <CircularProgress/>
                ) : (
                    fridges.map((image) => (
                        <ButtonBase
                            onClick={() => setRedirect(image.id)}
                            focusRipple
                            key={image.fridge_name}
                            className={classes.image}
                            focusVisibleClassName={classes.focusVisible}
                            style={{
                                width: image.width,
                            }}
                        >
                          <span
                              className={classes.imageSrc}
                              style={{
                                  backgroundImage: `url(${fridgeImage})`,
                              }}
                          />
                                            <span className={classes.imageBackdrop}/>
                                            <span className={classes.imageButton}>
                            <Typography
                                component="span"
                                variant="subtitle1"
                                color="inherit"
                                className={classes.imageTitle}
                            >
                              {image.fridge_name}
                                <span className={classes.imageMarked}/>
                            </Typography>
                          </span>
                        </ButtonBase>
                    ))
                )
            }
            {redirect && <Redirect to={path_list.FRIDGE.redirect(redirect)}/> }
        </div>
    );
}
