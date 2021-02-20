import React, { useState } from 'react'
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import logo from '../../assets/rose.png'
import useStyles from './styles.js';
import { Link, useLocation } from 'react-router-dom';

// recieve props 

const Navbar = ({ totalItems }) => {
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const classes = useStyles();
    const location = useLocation();

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

    const mobileMenuId = 'primary-search-account-menu-mobile';
    
    const renderMobileMenu = (
        <Menu anchorEl={mobileMoreAnchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} id={mobileMenuId} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={isMobileMenuOpen} onClose={handleMobileMenuClose}>
            <MenuItem>
                {/* integrate within material ui components using react router  */}
                <IconButton component={Link} to="/cart" aria-label="Show cart items" color="inherit">
                    {/* display number of items using totalitems object */}
                    <Badge badgeContent={totalItems} color="secondary">
                        <ShoppingCart />
                    </Badge>
                </IconButton>
                <p>Cart</p>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <AppBar position="fixed" className={classes.appBar} color="inherit">
                <Toolbar>
                    {/* material ui and react router specific syntax for button to route to home page */} 
                    <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit">
                        <img src={logo} alt="commerce.js" height="25px" className={classes.image} /> Lover's Embrace
                    </Typography>
                    <div className={classes.grow} />
                    {/* if route has / */}
                    {location.pathname === '/' && (
                    <div className={classes.button}>
                        {/* material ui and react router specific syntax for button to route to cart */} 
                        <IconButton component={Link} to="/cart" aria-label="Show cart items" color="inherit">
                            <Badge badgeContent={totalItems} color="secondary">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </div>
                    )}
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
        </>
    );
};

export default Navbar
