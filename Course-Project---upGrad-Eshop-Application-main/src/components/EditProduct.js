import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
    const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTczNDI1NDg4NywiZXhwIjoxNzM0MjYzMjg3fQ.3NNw9spqv5DwiQJqD__JeyqUQPeskr26diN2Nq0rIS_bN-gCUtXcbcGBFrtjUZ9ej63p_IlB0T7HAdbbpBwcMA";
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`);
        setForm(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`, form, {
        headers: { "x-auth-token": token,}
      });
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 3000); 
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      setError('Failed to update product!');
    }
  };

  return (
    <Box sx={{ width: 600, mx: 'auto', mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Edit Product</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" fullWidth value={form.name || ''} onChange={handleChange} />
        <TextField label="Category" name="category" fullWidth value={form.category || ''} onChange={handleChange} />
        <TextField label="Price" name="price" type="number" fullWidth value={form.price || ''} onChange={handleChange} />
        <TextField label="Description" name="description" fullWidth value={form.description || ''} onChange={handleChange} />
        <TextField label="Manufacturer" name="manufacturer" fullWidth value={form.manufacturer || ''} onChange={handleChange} />
        <TextField label="Available Items" name="availableItems" type="number" fullWidth value={form.availableItems || ''} onChange={handleChange} />
        <TextField label="Image URL" name="imageUrl" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
        <Button type="submit" variant="contained" fullWidth>Update Product</Button>
      </form>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      <Snackbar open={showSuccess} autoHideDuration={3000} message="Product updated successfully!" />
    </Box>
  );
};

export default EditProduct;