import React, {useContext, useEffect, useRef, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import {Button, CardHeader, CircularProgress} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Delete from '@material-ui/icons/Delete';
import {AlertContext, UserContext} from "context";
import {Redirect, useParams} from "react-router-dom";
import {ErrorOutlineTwoTone} from "@material-ui/icons";
import DetailsModal from "./components/DetailsModal";
import {be} from "../../constants/backendSetup";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import {path_list} from "../../constants/routes";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    fab: {
        position: "fixed",
        bottom: theme.spacing(1.5),
        right: theme.spacing(8),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const fetchProductsList = async (token, fridgeId) => {
    const url = `https://wasteless-backend.herokuapp.com/fridge/${fridgeId}/`
    const headers = {
        Authorization: "Token " + token,
        "Content-Type": "application/json",
    }

    const res = await fetch(url, {
        headers,
        method: "GET"
    });

    if (res.status === 200) {
        return await res.json();
    } else {
        throw res.status;
    }
};

const fetchDeleteProduct = async (token, productId) => {
    const baseURL = be.PRODUCTS + productId + '/';
    const headers = {
        Authorization: "Token " + token,
    }

    const request = await fetch(baseURL, {
        headers,
        method: "DELETE"
    });

    if (request.status !== 204) {
        throw request.status;
    }
}

export default function Album() {
    const classes = useStyles();

    const alertC = useRef(useContext(AlertContext));
    const user = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [productsList, setProductsList] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const {fridge_id} = useParams();
    const fridgeId = fridge_id;

    for(let i = 0; i < productsList.length; i++) {
        let newFormDate = getProductDate(productsList[i]);
        newFormDate.setHours(0,0,0,0);
        let now = new Date();
        now.setHours(0,0,0,0);

        let c1 = (productsList[i].product_name.toUpperCase().charCodeAt(0) * 5) % 256;
        let c2 = (productsList[i].product_name.toUpperCase().charCodeAt(1) * 5) % 256;
        let c3 = (productsList[i].product_name.toUpperCase().charCodeAt(2) * 5) % 256;
        productsList[i].backgroundColor = "rgb(" + c1 + "," + c2 + "," + c3 + ")";

        if (now > newFormDate){
            productsList[i].color = "red";
        } else if (now.setDate(now.getDate() + 4) > newFormDate) {
            productsList[i].color = "orange";
        } else {
            productsList[i].color = "black";
        }
        productsList[i].dateToCompare = newFormDate;
    }

    productsList.sort((a, b) => (a.dateToCompare > b.dateToCompare) ? 1 : -1);

    useEffect(() => {
        const loadProductsList = async (token) => {
            setLoading(true);
            try {
                let products = await fetchProductsList(token, fridgeId);
                setProductsList(products);
            } catch (e) {
                alertC.current.showAlert("Couldn't load products list!", "error");
            } finally {
                setLoading(false);
            }
        };
        loadProductsList(user.token);
    }, [user.token, fridgeId]);

    async function handleDeleteClick(e, id) {
        e.preventDefault()
        setLoading(true);
        try {
            await fetchDeleteProduct(user.token, id);
            let newProductList = productsList.filter((product) => product.id !== id)
            setProductsList(newProductList)
            alertC.current.showAlert("Successfully deleted product!", "success");
        } catch (ex) {
            alertC.current.showAlert("Couldn't delete product!", "error");
        } finally {
            setLoading(false);
        }
    }

    function getProductDate(product) {
        return new Date(product.expiration_date);
    }

    return (
        <React.Fragment>
            <CssBaseline/>
            <main>
                <Container className={classes.cardGrid} maxWidth="md">
                    {
                        loading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Grid container spacing={4}>
                                    {productsList.map((product, idxProduct) => (
                                        <Grid item key={idxProduct} xs={12} sm={6} md={4}>
                                            <Card className={classes.card}>
                                                <CardHeader
                                                    avatar={
                                                        <Avatar aria-label="recipe" className={classes.avatar} style={{backgroundColor: product.backgroundColor}}>
                                                            {product.dateToCompare < (new Date().setHours(0,0,0,0)) ? <ErrorOutlineTwoTone /> : product.product_name.charAt(0)}
                                                        </Avatar>
                                                    }
                                                    action={
                                                        <IconButton aria-label="delete" onClick={(e) => handleDeleteClick(e, product.id)}>
                                                            <Delete/>
                                                        </IconButton>
                                                    }
                                                />
                                                <CardContent className={classes.cardContent} style={{color: product.color}}>
                                                    <Typography gutterBottom variant="h5" component="h2">
                                                        {product.product_name}
                                                    </Typography>
                                                    <Typography>
                                                        Quantity: {product.quantity}
                                                    </Typography>
                                                    <Typography>
                                                        Expiration date: {product.expiration_date.split("T")[0]}
                                                    </Typography>
                                                    <Button variant="contained" color="primary" onClick={() => setOpenModal(product.id)}>
                                                        Show details
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Fab onClick={() => setRedirect(true)} className={classes.fab} variant="extended" color="secondary">
                                   <AddIcon className={classes.extendedIcon} />
                                   Add
                                </Fab>
                            </>
                        )
                    }
                </Container>
                <DetailsModal setOpen={setOpenModal} open={!!openModal} product_id={openModal} />
            </main>
            {redirect && <Redirect to={path_list.FRIDGE_NEW_PRODUCT.redirect(fridgeId)} />}
        </React.Fragment>
    );
}