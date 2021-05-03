import React, {useContext, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {be} from "constants/backendSetup";
import {getCORSHeaders} from "utils/fetchTools";
import {AlertContext, UserContext} from "context";
import HorizontalStepper from "components/HorizontalStepper";
import Button from "@material-ui/core/Button";
import BarcodeForm from "./components/BarcodeForm";
import ProductDataForm from "./components/ProductDataForm";
import AdditionalInfoForm from "./components/AdditionalInfoForm";
import {path_list} from "constants/routes";
import {Redirect} from 'react-router-dom';

const addProduct = async (token, data) => {
    const url = be.PRODUCTS;
    const headers = getCORSHeaders(token);
    const res = await fetch(url, {
        headers,
        body: JSON.stringify(data),
        method: "POST"
    });

    if (res.status === 201) {
        return await res.json();
    } else {
        throw res.status;
    }
}

const NewProduct = (props) => {
    const {fridge_id} = useParams();
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [barcodeExists, setBarcodeExists] = useState(true);
    const [validated, setValidated] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [data, setData] = useState({
        product_name: "",
        category: "",
        quantity_g: 0,
        quantity: 1,
        carbohydrates: 0,
        energy_kcal: 0,
        fat: 0,
        fiber: 0,
        proteins: 0,
        salt: 0,
        sodium: 0,
        image_url: "",
        date_added: (new Date()).toISOString(),
        expiration_date: new Date().toISOString(),
        fridge_id: fridge_id
    });
    const userC = useContext(UserContext);
    const alertC = useRef(useContext(AlertContext));
    const steps = {
        "Enter barcode": <BarcodeForm data={barcode} setData={setBarcode} barcodeRequired={barcodeExists} setBarcodeRequired={setBarcodeExists} />,
        "Get product data": <ProductDataForm data={data} setData={setData} barcode={barcode}/>,
        "Enter additional info": <AdditionalInfoForm data={data} setData={setData}/>
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addProduct(userC.token, data);
            setRedirect(path_list.FRIDGE.redirect(fridge_id));
        } catch(ex) {
            console.log(ex);
            alertC.current.showAlert(ex, "error")
        } finally {
            setLoading(false);
        }
    }

    const fetchHandleComponent = (handleGoBack) => (
        <div>
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
                Add product
            </Button>
            <Button color="primary" onClick={handleGoBack}>
                Back
            </Button>
        </div>
    )

    return (
        <>
            <React.Fragment>
                <form onSubmit={handleSubmit}>
                    <HorizontalStepper
                        onDoneComponent={fetchHandleComponent}
                        steps={steps}
                        disableNext={barcode === "" && barcodeExists}
                    />
                </form>
            </React.Fragment>
            {redirect && <Redirect to={path_list.FRIDGE.redirect(fridge_id)} />}
        </>
    )
};

export default NewProduct;