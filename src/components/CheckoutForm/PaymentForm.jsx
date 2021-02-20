import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review';

// start new stripe instance

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// recieve props

const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout }) => {
    // following stripe api
    // set handleSubmit from rect hook form as asyc function that takes in event, elements and stripe from stripe api
    const handleSubmit = async (event, elements, stripe) => {

    // prevents handleSubmit from submitting form to go through verification first        

    event.preventDefault();

    // if not stripe or not elements

    if (!stripe || !elements) return;

    // get CardElement from stripe

    const cardElement = elements.getElement(CardElement);

    // async function to convert payment information collected by elements into a PaymentMethod object
    // set error, PaymentMethod as object

    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    // if error, log error
    // else set orderData as a object that contains the following information
    // call onCaptureCheckout taking in checkoutToken.id and order data as
    // call nextStep

    if (error) {
      console.log('[error]', error);
    } else {
        const orderData = {
            line_items: checkoutToken.live.line_items,
            customer: { firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email },
            shipping: { name: 'International', street: shippingData.address1, town_city: shippingData.city, county_state: shippingData.shippingSubdivision, postal_zip_code: shippingData.zip, country: shippingData.shippingCountry },
            fulfillment: { shipping_method: shippingData.shippingOption },
            payment: {
            gateway: 'stripe',
            stripe: {
                payment_method_id: paymentMethod.id,
                },
            },
        };

        onCaptureCheckout(checkoutToken.id, orderData);

        nextStep();
        }
    };

    return (
        <>
        {/* pass checkoutToken as prop to child component */}
        <Review checkoutToken={checkoutToken} />
        <Divider />
        <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Payment method</Typography>
        {/* set stripe as new instance of stripe */}
        <Elements stripe={stripePromise}>
            {/* pass in elements and stripe as props to handleSubmit */}
            <ElementsConsumer>{({ elements, stripe }) => (
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                <CardElement />
                <br /> <br />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* on click, call backStep */}
                <Button variant="outlined" onClick={backStep}>Back</Button>
                {/* button is disabled if stripe is not true */}
                <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                    Pay {checkoutToken.live.subtotal.formatted_with_symbol}
                </Button>
                </div>
            </form>
            )}
            </ElementsConsumer>
        </Elements>
        </>
    );
};

export default PaymentForm;