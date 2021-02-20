import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';

import useStyles from './styles';

// recieve props

const Product = ({ product, onAddToCart }) => {
    const classes = useStyles();

    // set new function to add to cart
    
    const handleAddToCart = () => onAddToCart(product.id, 1);

    return (
    <Card className={classes.root}>
        <CardMedia className={classes.media} image={product.media.source} title={product.name} />
        <CardContent>
            <div className={classes.cardContent}>
                {/* display product.name object using destructuring*/}
                <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                </Typography>
                {/* display product.price.formatted object using destructuring */}
                <Typography gutterBottom variant="h5" component="h2">
                    ${product.price.formatted}
                </Typography>
            </div>
            {/* inject html from */}
            <Typography dangerouslySetInnerHTML={{ __html: product.description }} variant="body2" color="textSecondary" component="p" />
        </CardContent>
            <CardActions disableSpacing className={classes.cardActions}>
                {/* on click, call new function created in conjunction with onAddToCart */}
                <IconButton aria-label="Add to Cart" onClick={handleAddToCart}>
                    <AddShoppingCart />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default Product;