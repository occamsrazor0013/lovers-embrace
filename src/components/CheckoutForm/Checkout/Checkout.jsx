import React, { useState, useEffect } from 'react';
import { CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import { commerce } from '../../../lib/commerce';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import useStyles from './styles';

const steps = ['Shipping address', 'Payment details'];

// recieve props

const Checkout = ({ cart, onCaptureCheckout, order, error }) => {

    // states used

    const [checkoutToken, setCheckoutToken] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [shippingData, setShippingData] = useState({});
    const classes = useStyles();
    const history = useHistory();

    // visualization of stepper

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

    // after mounting, if card id exists, let generateTOkenbe equal to a new token created by commerce applicationCache
    // set token as the generated token using fuction from hook
    // if there are errors, route back to homepage
    // re renders if cart state changes

    useEffect(() => {
        if (cart.id) {
            const generateToken = async () => {
                try {
                    const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
                    
                    setCheckoutToken(token);
                } catch {
                if (activeStep !== steps.length) history.push('/');
                }
            };
            
            generateToken();
        }
    }, [cart]);

    // test function that recieves data parameter sets shippingData as data using setShippingData in hook, calls nextStep function

    const test = (data) => {
        setShippingData(data);

        nextStep();
    };

    {/* let confirmation component be the following, some logic using ternary operator, order.customer is true, display the following div, otherwise display circularprogress */}

    let Confirmation = () => (order.customer ? (
        <>
            <div>
            <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            {/* material ui and react router specific syntax for button to route to main page */}
            <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
        </>
        ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    ));
    
    // for any errors, let confirmation component be the following

    if (error) {
        Confirmation = () => (
            <>
                <Typography variant="h5">Error: {error}</Typography>
                    <br />
                <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
            </>
        );
    }

    // let form be the following, bounded by boolean of activeStep being strict equal to 0 is true
    // display address form if true, otherwise display payment form

    const Form = () => (activeStep === 0
        // pass in checkoutToken, nextStep, setShippingData, test as props
        ? <AddressForm checkoutToken={checkoutToken} nextStep={nextStep} setShippingData={setShippingData} test={test} />
        // pass in checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout as props
        : <PaymentForm checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} />);
        
    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                        {/* pass in activeStep as prop */}
                        <Stepper activeStep={activeStep} className={classes.stepper}>
                            {/* map steps for each label */}
                            {steps.map((label) => (
                                // set ket as each label
                                <Step key={label}>
                                    {/* display label */}
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    {/* some logic using ternary operator, display confirmation component, otherwise display form only of checkoutToken exists */}
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    );
};

export default Checkout;