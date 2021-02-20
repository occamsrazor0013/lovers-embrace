import React from 'react';
import { Typography, Button, Card, CardActions, CardContent, CardMedia } from '@material-ui/core';

import useStyles from './styles';

// recieve props

const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {
    const classes = useStyles();

    // new function for updating card quantity

    const handleUpdateCartQty = (lineItemId, newQuantity) => onUpdateCartQty(lineItemId, newQuantity);

    // new function for removing from cart

    const handleRemoveFromCart = (lineItemId) => onRemoveFromCart(lineItemId);

    return (
        <Card className="cart-item">
            <CardMedia image={item.media.source} alt={item.name} className={classes.media} />
            <CardContent className={classes.cardContent}>
                <Typography variant="h4">{item.name}</Typography>
                <Typography variant="h5">{item.line_total.formatted_with_symbol}</Typography>
                </CardContent>
            <CardActions className={classes.cardActions}>
            <div className={classes.buttons}>
                {/* on click, call function created in conjunction with onUpdateCartQty */}
                <Button type="button" size="small" onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}>-</Button>
                <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
                {/* on click, call function created in conjunction with onUpdateCartQty */}
                <Button type="button" size="small" onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}>+</Button>
            </div>
                {/* on click, call function created in conjunction with handleRemoveFromCart */}
                <Button variant="contained" type="button" color="secondary" onClick={() => handleRemoveFromCart(item.id)}>Remove</Button>
            </CardActions>
        </Card>
    );
};

export default CartItem;