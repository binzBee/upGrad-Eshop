import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteProduct = () => {
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTczNDI1NDg4NywiZXhwIjoxNzM0MjYzMjg3fQ.3NNw9spqv5DwiQJqD__JeyqUQPeskr26diN2Nq0rIS_bN-gCUtXcbcGBFrtjUZ9ej63p_IlB0T7HAdbbpBwcMA";
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState({});
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch Product Details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details.');
      }
    };
    fetchProduct();
  }, [id]);

  // Delete Product Function
  const handleDelete = async () => {
    try {
      await axios.delete(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`, {
        headers: { "x-auth-token": token},
      });

      setShowSuccess(true); // Trigger success message
      setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
      setError('Failed to delete the product.');
    }
  };

  // Open Confirmation Dialog
  const handleOpen = () => setOpen(true);

  // Close Confirmation Dialog
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ maxWidth: '600px', mx: 'auto', mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Delete Product</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      <Typography variant="h6">Are you sure you want to delete this product?</Typography>
      <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
        <strong>Name:</strong> {product.name || 'Loading...'} <br />
        <strong>Category:</strong> {product.category || 'N/A'} <br />
        <strong>Price:</strong> ₹ {product.price || 'N/A'}
      </Typography>

      <Button variant="contained" color="error" onClick={handleOpen}>Delete Product</Button>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product <strong>{product.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message="Product deleted successfully!"
      />
    </Box>
  );
};

export default DeleteProduct;