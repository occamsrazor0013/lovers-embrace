import React, { useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Navbar, Products, Cart, Checkout } from './components';
import { commerce } from './lib/commerce';

const App = () => {

    // states used

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    // async function to get all products from list, use destructuring to retrieve data

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();

        setProducts(data);
    };

    // async function to get create new cart  or retrieve cart id

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());

    };

    // async function to add product to cart, by productid and quantity

    const handleAddToCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);

        setCart(item.cart);
    };

    // async function to update cart, by lineitemid and quantity while in the cart

    const handleUpdateCartQty = async (lineItemId, quantity) => {
        const response = await commerce.cart.update(lineItemId, { quantity });

        setCart(response.cart);
    };

    // async function to remove specific line item from cart

    const handleRemoveFromCart = async (lineItemId) => {
        const response = await commerce.cart.remove(lineItemId);

        setCart(response.cart);
    };

    // async function to empty all items in cart but does not create new cart

    const handleEmptyCart = async () => {
        const response = await commerce.cart.empty();

        setCart(response.cart);
    };

    // async function to create a new cart and update the stored cart ID

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();

        setCart(newCart);
    };

    // async function to handle checkout
    // sets constant while capturing token and calling creating a new order
    // sets order calling constant
    // refreshes cart after 

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
        const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

        setOrder(incomingOrder);

        refreshCart();
        } catch (error) {
        setErrorMessage(error.data.error.message);
        }
    };

    // after mount, call the fetchProducts and fetchCart
    // will not call useeffect for any component updates

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    return (
        // react routing for different pages
        <Router>
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            {/* navbar is always displaying */}
            <Navbar totalItems={cart.total_items} handleDrawerToggle={handleDrawerToggle} />
            <Switch>
            {/* on / path, display products component, pass in products, handleAddToCart, handleUpdateCartQty as props to */}
            <Route exact path="/">
                <Products products={products} onAddToCart={handleAddToCart} />
            </Route>
            {/* on /cart path, display cart component, pass in handleUpdateCartQty, handleRemoveFromCart, handleEmptyCart as props */}
            <Route exact path="/cart">
                <Cart cart={cart} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} handleEmptyCart={handleEmptyCart} />
            </Route>
            {/* on /checkout path, display checkout component, pass in cart, order, handleCaptureCheckout and errorMessage as props */}
            <Route path="/checkout" exact>
                <Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage} />
            </Route>
            </Switch>
        </div>
        </Router>
    );
};

export default App;