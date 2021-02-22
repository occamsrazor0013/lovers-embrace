import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { commerce } from '../../lib/commerce';
import FormInput from './FormInput';

// recieve props

const AddressForm = ({ checkoutToken, test }) => {

    // set states

    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const methods = useForm();

    // async function to set countries object using localListShippingCountries by checkoutTokenId
    // set countries as new state for shippingCountries value using setShippingCountries function
    // set keys of countries object that are index 0 as new state for shippingCountry value using setShippingCountry function

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    };

    // async function to set subdivisions object using localeListSubdivisions by countryCode
    // set subdivisions as new state for shippingSubdivisions value using setShippingSubdivisions function
    // set keys of subdivisions object that are index 0 as new state for shippingSubdivision value using setShippingSubdivision function

    const fetchSubdivisions = async (countryCode) => {

        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    };

    // async function to set options using getShippingOptions by checkoutTOkenId and country, region: stateProvince
    // set options as new state for shippingOptions value using setShippingOptions function
    // set value of id of index 0 as new state for shippingOption value using setShippingOption function

    const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });

        setShippingOptions(options);
        setShippingOption(options[0].id);
    };

    // after component is rendered, call fetchShippingCountries that takes in checkoutToken.id parameter
    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    }, []);

    // after component is rendered, if shippingCountry is true, call fetchSubdivisions function that takes in shippingCountry parameter
    // re renders component if shippingCountry state updates

    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry);
    }, [shippingCountry]);

    // after component is rendered, if shippingSubdivision is true, call fetchSubdivisions function that takes in checkoutToken.id, shippingCountry and shippingSubdivison parameter
    // re renders component if shippingCountry state updates

    useEffect(() => {
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }, [shippingSubdivision]);

    return (
        <>
        <Typography variant="h6" gutterBottom>Shipping address</Typography>
        {/* destructure methods */}
        <FormProvider {...methods}>
            {/* on form submit, take data parameters and set as shipping data for checkout form */}
            <form onSubmit={methods.handleSubmit((data) => test({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
            <Grid container spacing={3}>
                {/* form input function component for each input field */}
                <FormInput required name="firstName" label="First name" />
                <FormInput required name="lastName" label="Last name" />
                <FormInput required name="address1" label="Address line 1" />
                <FormInput required name="email" label="Email" />
                <FormInput required name="city" label="City" />
                <FormInput required name="zip" label="Zip / Postal code" />
                <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Country</InputLabel>
                {/* on change, call setShippingCountry function with event value */}
                <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                    {/* for all shippingCountries entries, map code and name to id and label
                    for each item, map to display label */}
                    {Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        {item.label}
                    </MenuItem>
                    ))}
                </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Subdivision</InputLabel>
                {/* on change, call setShippingSubdivision function with event value */}
                <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                    {/* for all shippingSubdivisions entries, map code and name to id and label
                    for each item, map to display label */}
                    {Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        {item.label}
                    </MenuItem>
                    ))}
                </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Options</InputLabel>
                {/* on change, call setShippingOption function with event value */}
                <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                    {/* for all shippingOptions object, map id and label  to id and label
                    for each item, map to display label */}
                    {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        {item.label}
                    </MenuItem>
                    ))}
                </Select>
                </Grid>
            </Grid>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* material ui and react router specific syntax for button to route to cart */}
                <Button component={Link} variant="outlined" to="/cart">Back to Cart</Button>
                <Button type="submit" variant="contained" color="primary">Next</Button>
            </div>
            </form>
        </FormProvider>
        </>
    );
};

export default AddressForm;