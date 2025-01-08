import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        contactNumber: '',
        role: [] // Fix: Initialize as empty array
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Correct API request
            await axios.post(`https://dev-project-ecommerce.upgrad.dev/api/auth/signup`, form);
            navigate('/login');
        } catch (error) {
            console.error('Signup failed:', error.response?.data || error.message);
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <Box sx={{ width: 400, mx: 'auto', mt: 10, p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Signup</Typography>
            <form onSubmit={handleSubmit}>
                <TextField label="First Name" name="firstName" fullWidth sx={{ mb: 2 }}
                    value={form.firstName} onChange={handleChange} required />
                <TextField label="Last Name" name="lastName" fullWidth sx={{ mb: 2 }}
                    value={form.lastName} onChange={handleChange} required />
                <TextField label="Email" name="email" type="email" fullWidth sx={{ mb: 2 }}
                    value={form.email} onChange={handleChange} required />
                <TextField label="Contact Number" name="contactNumber" fullWidth sx={{ mb: 2 }}
                    value={form.contactNumber} onChange={handleChange} required />
                <TextField label="Password" name="password" type="password" fullWidth sx={{ mb: 2 }}
                    value={form.password} onChange={handleChange} required />
                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                <Button type="submit" variant="contained" fullWidth>Signup</Button>
            </form>
        </Box>
    );
};

export default Signup;