import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import CartItem from './CartItem/CartItem';
import useStyles from './styles';

// recieve props

const Cart = ({ cart, onUpdateCartQty, onRemoveFromCart, handleEmptyCart }) => {
    const classes = useStyles();

    // routing to home page if no items

    const renderEmptyCart = () => (
      <Typography variant="subtitle1">You have no items in your shopping cart,
          <Link to="/" className={classes.link}> start adding some</Link>!
      </Typography>
    );

    // if line items does not exist on page yet, return loading

    if (!cart.line_items) return 'Loading';


    // render cart

    const renderCart = () => (
      <>
        <Grid container spacing={3}>
            {/* map cart line items for each line item */}
            {cart.line_items.map((lineItem) => (
                <Grid item xs={12} sm={4} key={lineItem.id}>
                {/* pass on lineItem, onUpdateCartQty, onRemoveFromCart as props */}
                <CartItem item={lineItem} onUpdateCartQty={onUpdateCartQty} onRemoveFromCart={onRemoveFromCart} />
                </Grid>
            ))}
        </Grid>
        <div className={classes.cardDetails}>
            <Typography variant="h4">Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
        <div>
            {/* on click, call handleEmptyCart */}
            <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty cart</Button>
            {/* material ui and react router specific syntax for button to route to checkout */}
            <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">Checkout</Button>
        </div>
        </div>
      </>
    );

    return (
      <Container>
        <div className={classes.toolbar} />
        <Typography className={classes.title} variant="h3" gutterBottom>Your Shopping Cart</Typography>
        {/* some logic using ternary operator, if cart line item length is false is true, display renderEmptyCart, otherwise display renderCart*/}
        { !cart.line_items.length ? renderEmptyCart() : renderCart() }
      </Container>
    );
};

export default Cart;
