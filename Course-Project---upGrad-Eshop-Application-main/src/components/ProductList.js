// src/pages/ProductList.js
import React, { useState, useEffect,useContext } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Button, ToggleButton, ToggleButtonGroup, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProductContext } from './ProductContext';

const ProductList = ({isLoggedIn, userRole }) => {
  // const [products, setProducts] = useState([]);
  const { products, setProducts } = useContext(ProductContext);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories on component mount
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`https://dev-project-ecommerce.upgrad.dev/api/products/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [categories]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://dev-project-ecommerce.upgrad.dev/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [setProducts]);

  const filteredProducts = () => {
    let filtered = selectedCategory !== "all" ? (products.filter((product) =>
    product.category === selectedCategory)) : (products);

    switch (sortBy) {
      case 'priceHighToLow':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'priceLowToHigh':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'newest':
        return [...filtered].sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
      default:
        return filtered;
    }

  }

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };


  if (!isLoggedIn) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error">Please Login to view products</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>Product List</Typography>
      <Box>
      {/* Category Toggle Buttons */}
      <ToggleButtonGroup
        value={selectedCategory}
        exclusive
        onChange={handleCategoryChange}
        sx={{ marginBottom: 3, marginLeft:50}}
        
      >
        <ToggleButton value="all">All</ToggleButton>
        {categories.map((category) => (
          <ToggleButton key={category} value={category}>
            {category}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      </Box>

      {/* Sort By */}
      <FormControl sx={{ minWidth: 200, mb: 3}}>
        <InputLabel sx={{ fontSize: 25, mb: 2 }}>Sort By:</InputLabel>
        <Select value={sortBy} onChange={handleSortChange} displayEmpty sx={{ mt: 2 }}>
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="priceHighToLow">Price High to Low</MenuItem>
          <MenuItem value="priceLowToHigh">Price Low to High</MenuItem>
          <MenuItem value="newest">Newest</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {filteredProducts().map((product) => (
          <Card key={product.id} sx={{ width: 400}}>
            <CardMedia
              component="img"
              height="300"
              image={product.imageUrl}
              alt={product.name}
            />
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ mb: 1 }}>{product.name}</Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  Price: <span style={{ color: 'brown' }}>₹ {product.price}</span>
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {product.description}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button
                  variant="contained"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  Buy
                </Button>
                {userRole === 'admin' && (
                  <>
                    <Box display="flex" alignItems="center">
                      <Button color="gray" startIcon={<EditIcon />} onClick={() => navigate(`/edit-products/${product.id}`)}></Button>
                      <Button color="gray" startIcon={<DeleteIcon />} onClick={() => navigate(`/delete-products/${product.id}`)}></Button>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
    
  );
};

export default ProductList;