import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `https://dev-project-ecommerce.upgrad.dev/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (!product) {
    return <Typography align="center" variant="h5">Loading...</Typography>;
  }

  const handleOrder = () => {
    navigate('/order', { state: { product, quantity } });
  };

  return (
    <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto', mt: '100px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '10px' }}
        />
        <Box sx={{ ml: 4 }}>
          {/* Name and Available Quantity */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h4" >{product.name}</Typography>
            <Typography
              variant="body2"
              sx={{
                backgroundColor: '#1976d2', // Blue background
                color: 'white', // White font color
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 'bold',
              }}
            >
              Available Quantity: {product.availableItems}
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Category:</strong> {product.category}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {product.description}
          </Typography>
          <Typography variant="h6" sx={{ color: 'red', mb: 1 }}>
            ₹ {product.price}
          </Typography>

          {/* Enter Quantity and Place Order */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <TextField
              label="Enter Quantity *"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 1, max: product.availableItems }}
              sx={{ width: '200px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleOrder}
              disabled={quantity < 1 || quantity > product.availableItems}
            >
              Place Order
            </Button>
          </Box>
        </Box>
      </Box>

      <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
        Back to Products
      </Button>
    </Box>
  );
};

export default ProductDetails;