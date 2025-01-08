
import React from 'react';
import { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, TextField, Box, InputBase } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import { ProductContext } from './ProductContext';

const NavigationBar = ({ isLoggedIn, userRole, handleLogout }) => {
  const navigate = useNavigate();


  const [searchQuery, setSearchQuery] = useState('');
  const { setProducts } = useContext(ProductContext);
  // const [products, setProducts] = useState([]);


  // Corrected search handler
  const handleSearch = async (event) => {
    const query = event.target.value.trim();
    setSearchQuery(query);

    // if (!query) {
    //   setProducts([]); // Clear results on empty query
    //   return;
    // }

    try {
      const response = await axios.get(
        `https://dev-project-ecommerce.upgrad.dev/api/products`,
        { params: { name: query } } // Ensure correct query format
      );

      const filteredProducts = response.data.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );

      setProducts(filteredProducts);
      // console.log("Filtered Products:", products);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };


  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section: Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to="/orders">
            <ShoppingCartIcon />
          </IconButton>
          <Typography variant="h6" sx={{ textDecoration: 'none', color: 'inherit' }}>
            upGrad Eshop
          </Typography>
        </Box>

        {/* Centered Search Bar */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 2,
            minWidth: 400,
            mx: 'auto',
          }}
        >
          <SearchIcon sx={{ position: 'absolute', left: 10, color: 'gray' }} />
          <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              width: '100%',
              pl: 5,
              pr: 2,
              py: 0.5,
            }}
          />
        </Box>

        {/* Right Section: User Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* User Actions */}
          {!isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/login" >
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup" >
                Signup
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>

              {/* Only Admins See This */}
              {userRole === 'admin' && (
                <Button color="inherit" component={Link} to="/add-products">
                  Add Products
                </Button>
              )}

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>

        {/* Product Result Display */}
        {/* {products.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'white',
              padding: 2,
              borderRadius: 1,
              width: '60%',
              maxHeight: 400,
              overflowY: 'auto',
              boxShadow: 3,
            }}
          >
            {products.map((product) => (
              <Box key={product.id} sx={{ mb: 2, borderBottom: '1px solid #ddd', pb: 1 }}>
                {Object.entries(product).map(([key, value]) => (
                  <Typography key={key} sx={{ lineHeight: 1.8 }}>
                    <span style={{ color: 'blue', fontWeight: 600 }}>{key}:</span>{' '}
                    <span style={{ color: 'brown' }}>{value}</span>
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
        )} */}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;