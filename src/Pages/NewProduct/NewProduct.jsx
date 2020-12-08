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
    const [validated, setValidated] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [data, setData] = useState({
        product_name: "",
        quantity_g: 0,
        quantity: 0,
        carbohydrates: 0,
        energy_kcal: 0,
        fat: 0,
        fiber: 0,
        proteins: 0,
        salt: 0,
        sodium: 0,
        image_url: "",
        date_added: (new Date()).toISOString(),
        expiration_date: "",
        fridge_id: fridge_id
    });
    const userC = useContext(UserContext);
    const alertC = useRef(useContext(AlertContext));
    const steps = {
        "Enter barcode": <BarcodeForm data={barcode} setData={setBarcode} />,
        "Get product data": <ProductDataForm data={data} setData={setData} barcode={barcode}/>,
        "Enter additional info": <AdditionalInfoForm data={data} setData={setData}/>
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addProduct(userC.token, data)
        } catch(ex) {
            alertC.current.showAlert(ex, "error")
        } finally {
            setLoading(false);
        }
    }

    const fetchHandleComponent = (
        <div>
            <Button variant="fill" color="primary" fullWidth onClick={handleSubmit}>
                Add product
            </Button>
            <Button variant="outlined" color="secondary" fullWidth>
                Cancel
            </Button>
        </div>
    )

    return (
        <React.Fragment>
            <form>
                <HorizontalStepper
                    onDoneComponent={fetchHandleComponent}
                    steps={steps}
                />
            </form>
        </React.Fragment>
    )
};

export default NewProduct;