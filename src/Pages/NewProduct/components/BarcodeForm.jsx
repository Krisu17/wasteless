import React from 'react';
import {Grid, TextField} from "@material-ui/core";

const BarcodeForm = ({data, setData}) => {
    return (
        <>
            <Grid item xs={12}>
                <TextField
                    type="text"
                    variant="outlined"
                    required
                    fullWidth
                    id="barcode"
                    label="Barcode number"
                    autoComplete="barcode"
                    value={data.barcode}
                    onChange={e => setData(e.target.value)}
                />
            </Grid>
        </>
    )
};

export default BarcodeForm;