import React, {useContext, useEffect, useRef, useState} from "react";
import {AlertContext, UserContext} from "context";
import UniversalModal from "../../../components/UniversalModal";
import {CircularProgress, ListItem, Typography} from "@material-ui/core";

const getProductData = async(token, product_id) => {
    const url = "https://wasteless-backend.herokuapp.com/products/" + product_id + "/";
    const headers = {
        "Authorization": "Token " + token
    };
    let res = await fetch(url, {
        headers,
        method: "GET"
    });

    if (res.status === 200) {
        return await res.json();
    } else {
        throw res.status;
    }
};

const parseDate = (dateString) => {
    let d = new Date(dateString);
    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    let month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    return day + "-" + month + "-" + d.getFullYear();
}

const mapData = (data) => ({
    "Product name": data.product_name,
    "Quantity": data.quantity,
    "Weight (gram)": data.quantity_q,
    "Energy (kcal)": data.energy_kcal,
    "Carbohydrates": data.carbohydrates,
    "Proteins": data.proteins,
    "Fat": data.fat,
    "Fiber": data.fiber,
    "Salt": data.salt,
    "Sodium": data.sodium,
    "Added": parseDate(data.date_added),
    "Expires at": parseDate(data.expiration_date)
});

const DetailsModal = ({product_id, open, setOpen}) => {
    const [data,setData] = useState({});
    const [loading, setLoading] = useState(false);
    const user = useContext(UserContext);
    const alertC = useRef(useContext(AlertContext));

    useEffect(() => {
        const loadProductDetails = async () => {
            setLoading(true);
            try {
                let d = mapData( await getProductData(user.token, product_id) );
                setData(d);
            } catch(ex) {
                console.log(ex);
                alertC.current.showAlert("There was an error loading product data", "error");
            } finally {
                setLoading(false);
            }
        };
        if (product_id) {
            loadProductDetails();
        }
    }, [product_id, user.token]);

    return (
        <UniversalModal open={open} setOpen={setOpen} title="Product details">
            {
                loading ? (
                    <CircularProgress />
                ) : (
                    Object.keys(data).map((item) => (
                        <ListItem key={item}>
                            <Typography variant="button" gutterBottom>{item}: </Typography>
                            <Typography variant="body2" gutterBottom>{data[item] || "not given"}</Typography>
                        </ListItem>
                    ))
                )
            }
        </UniversalModal>
    )
};

export default DetailsModal;