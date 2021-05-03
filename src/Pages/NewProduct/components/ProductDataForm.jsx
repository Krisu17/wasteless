import React, {useContext, useEffect, useRef, useState} from "react";
import {AlertContext, UserContext} from "context";
import {be, off_API} from "constants/backendSetup";
import {Avatar, Backdrop, CircularProgress, Grid, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Autocomplete, {createFilterOptions} from "@material-ui/lab/Autocomplete";
import {getCORSHeaders} from "../../../utils/fetchTools";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    avatarContainer: {
        marginBottom: theme.spacing(2),
        // textAlign: "center",
        display: "flex",
        justifyContent: "space-evenly"
    },
    avatar: {
        display: "block",
        textAlign: "center",
        margin: theme.spacing(1),
        background: theme.palette.secondary
    }

}));

const fetchProductData = async (barcodeNumber) => {
    const url = `${off_API}${barcodeNumber}`;
    const res = await fetch(url, {
        method: "GET"
    });

    if (res.status === 200) {
        let parsedRes = await res.json();
        if (parsedRes.status === 0) {
            throw parsedRes.status_verbose || "product not found";
        } else {
            return parsedRes.product;
        }
    } else {
        throw res.status;
    }
};

const mapProductData = (data) => ({
    product_name: data.product_name_en || data.product_name,
    energy_kcal: data.nutriments["energy-kcal"],
    carbohydrates: data.nutriments.carbohydrates,
    fat: data.nutriments.fat,
    fiber: data.nutriments.fiber || 0,
    proteins: data.nutriments.proteins,
    quantity_g: data.product_quantity || "",
    image_url: data.image_front_small_url || data.image_small_url

});

async function fetchNewCategory(token, ingredient_name) {
    const url = be.INGREDIENTS;
    const headers = getCORSHeaders(token);

    const res = await fetch(url, {
        headers,
        method: "POST",
        body: JSON.stringify({
            ingredient_name: ingredient_name
        })
    });

    if (res.status !== 201) {
        throw "Couldn't add new ingredient"
    }
}

async function fetchCategoryList(token) {
    const url = be.INGREDIENTS;
    const headers = getCORSHeaders(token);

    const res = await fetch(url, {
        headers,
        method: "GET"
    });

    if (res.status !== 200) {
        throw "Couldn't get category list"
    }

    return await res.json()
}

const ProductDataForm = ({data, setData, barcode}) => {
    const alertC = useRef(useContext(AlertContext));
    const user = useContext((UserContext));
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = React.useState('');
    const [categoryList, setCategoryList] = useState([]);
    const classes = useStyles();
    const filter = createFilterOptions();

    useEffect(() => {
        const loadProductData = async() => {
            setLoading(true);
            try {
                let product = await fetchProductData(barcode);
                setData( {...data, ...mapProductData(product)} );
            } catch(e) {
                alertC.current.showAlert("Couldn't load product info, please type it manually.", "error");
            } finally {
                setLoading(false);
            }
        };
        loadProductData();
    }, [barcode]);

    useEffect(() => {
        loadCategoryList();
    }, [])

    useEffect(()=>{
        setData({...data, category: category})
    },[category])

    const loadCategoryList = async () => {
        try {
            let res = await fetchCategoryList(user.token);
            res.forEach((e) => e.title = e.ingredient_name)
            setCategoryList(res)
        } catch (err) {
            alertC.current.showAlert(err, "error")
        }

    }

    return loading ? (
        <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    ) : (
        <>
            <div className={classes.avatarContainer}>
                <Avatar className={classes.avatar}>
                    <img src={data.image_url} alt={data?.product_name?.charAt(0) || "P"} />
                </Avatar>
                <TextField
                    autoComplete="product_name"
                    variant="outlined"
                    fullWidth
                    id="product_name"
                    label="Detected product name"
                    autoFocus
                    value={data.product_name}
                    onChange={e => setData({...data, product_name: e.target.value})}
                />
            </div>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        autoComplete="quantity_g"
                        variant="outlined"
                        fullWidth
                        id="quantity"
                        label="Quantity (grams)"
                        autoFocus
                        value={data.quantity_g}
                        onChange={e => setData({...data, quantity_g: e.target.value})}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="carbohydrates"
                        label="Carbohydrates"
                        autoComplete="carbohydrates"
                        value={data.carbohydrates}
                        onChange={e => setData({...data, carbohydrates: e.target.value})}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        autoComplete="energy_kcal"
                        variant="outlined"
                        fullWidth
                        id="energy_kcal"
                        label="Energy (kcal)"
                        autoFocus
                        value={data.energy_kcal}
                        onChange={e => setData({...data, energy_kcal: e.target.value})}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        autoComplete="fat"
                        variant="outlined"
                        fullWidth
                        id="fat"
                        label="Fat"
                        autoFocus
                        value={data.fat}
                        onChange={e => setData({...data, fat: e.target.value})}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    {/*change to datepicker!!!!*/}
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="fiber"
                        label="Fiber"
                        autoComplete="carbohydrates"
                        value={data.fiber}
                        onChange={e => setData({...data, fiber: e.target.value})}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        autoComplete="energy_kcal"
                        variant="outlined"
                        fullWidth
                        id="proteins"
                        label="Proteins"
                        autoFocus
                        value={data.proteins}
                        onChange={e => setData({...data, proteins: e.target.value})}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        freeSolo
                        onChange={async (event, newValue) => {
                            if (newValue && newValue?.id) {
                                // timeout to avoid instant validation of the dialog's form.
                                setCategory(newValue?.ingredient_name)
                            } else if (newValue) {
                                try {
                                    if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s]+$/.test(newValue?.ingredient_name)) {
                                        throw "Wrong category format"
                                    }
                                    if (categoryList.filter((e) => e.ingredient_name === newValue?.ingredient_name?.toLowerCase()).length !== 0) {
                                        throw "Category already on list"
                                    }
                                    await fetchNewCategory(user.token, newValue?.ingredient_name?.toLowerCase())
                                    setCategory(newValue?.ingredient_name?.toLowerCase())
                                    loadCategoryList();
                                } catch (err) {
                                    alertC.current.showAlert(err, "error")
                                }
                            } else {
                                setCategory("")
                            }
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);

                            if (params.inputValue !== '') {
                                let element = {
                                    title: "Add " + params.inputValue,
                                    ingredient_name: params.inputValue,
                                }
                                filtered.push(element);
                            }

                            return filtered;
                        }}
                        options={categoryList}
                        getOptionLabel={(option) => {
                            try {
                                return option.title
                            } catch (e) {
                                console.log(e)
                            }
                        }}
                        className={classes.textField}
                        renderInput={(params) => <TextField {...params} label="Category" variant="outlined"/>}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default ProductDataForm;