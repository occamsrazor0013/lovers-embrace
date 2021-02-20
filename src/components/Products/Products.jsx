  
import React from 'react';
import Grid from '@material-ui/core/Grid';

import Product from './Product/Product';
import useStyles from './styles';

// recieve props

const Products = ({ products, onAddToCart }) => {
    const classes = useStyles();

    // while products are still loading

    if (!products.length) return <p>Loading...</p>;

    return (
        <main className={classes.content}>
        <div className={classes.toolbar} />
        <Grid container justify="center" spacing={4}>
            {/* map each product from the products object using material ui */}
            {products.map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
                {/* pass product and onAddToCart as props to child component */}
                <Product product={product} onAddToCart={onAddToCart} />
            </Grid>
            ))}
        </Grid>
        </main>
    );
    };

export default Products;