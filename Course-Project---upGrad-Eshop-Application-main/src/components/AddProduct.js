import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert,InputLabel} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Format date as dd-MMM-yyyy
const formatDate = (date) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-GB', options).replace(',', '');
};

const AddProduct = () => {
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTczNDI1NDg4NywiZXhwIjoxNzM0MjYzMjg3fQ.3NNw9spqv5DwiQJqD__JeyqUQPeskr26diN2Nq0rIS_bN-gCUtXcbcGBFrtjUZ9ej63p_IlB0T7HAdbbpBwcMA";
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    manufacturer: '',
    availableItems: '',
    imageUrl: '',
    addedDate: formatDate(new Date()),
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://dev-project-ecommerce.upgrad.dev/api/products`, form, {
        headers: { "x-auth-token": token, }
      });
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 3000); 
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
      setError('Failed to add product!');
    }
  };

  return (
    <Box sx={{ width: 600, mx: 'auto', mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Add Product</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
        <TextField label="Category" name="category" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
        <TextField label="Price" name="price" type="number" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
        <TextField label="Description" name="description" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
        <TextField label="Manufacturer" name="manufacturer" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
        <TextField label="Available Items" name="availableItems" type="number" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
        <TextField label="Image URL" name="imageUrl" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
        {/* Date Field with Custom Format */}
        <TextField
          label="Added Date"
          name="addedDate"
          type="text"
          fullWidth
          required
          sx={{ mb: 2 }}
          value={form.addedDate}
          onChange={handleChange}
          InputLabel={{
            shrink: true,
          }}
        />
        <Button type="submit" variant="contained" fullWidth>Add Product</Button>
      </form>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      <Snackbar open={showSuccess} autoHideDuration={3000} message="Product added successfully!" />
    </Box>
  );
};

export default AddProduct;