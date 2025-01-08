
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setUserRole }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://dev-project-ecommerce.upgrad.dev/api/auth/signin`,
        form
      );

      // Update role and login state
      const userRole = response.data.roles.includes('ADMIN') ? 'admin' : 'user';

      setIsLoggedIn(true);    // Set login status
      setUserRole(userRole);  // Set role from response

      console.log('Login Success:', response.data);
      navigate('/');  // Redirect to homepage
    } catch (error) {
      setError('Invalid username or password.');
    }
  };

  return (
    <Box sx={{ width: 400, mx: 'auto', mt: 10, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email Address"
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth>Login</Button>
      </form>
    </Box>
  );
};

export default Login;