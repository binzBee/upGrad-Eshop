import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CreateOrder = () => {
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTczNDI1NDg4NywiZXhwIjoxNzM0MjYzMjg3fQ.3NNw9spqv5DwiQJqD__JeyqUQPeskr26diN2Nq0rIS_bN-gCUtXcbcGBFrtjUZ9ej63p_IlB0T7HAdbbpBwcMA";
  const navigate = useNavigate();
  const location = useLocation();
  const { product, quantity } = location.state || {}; // Fallback to handle undefined state

  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState({
    name: '',
    contactNumber: '',
    street: '',
    city: '',
    state: '',
    landmark: '',
    zipcode: '',
  });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const steps = ['Product Details', 'Address Details', 'Confirm Order'];

  useEffect(() => {
    if (!product || !quantity) {
      navigate('/', { replace: true }); // Redirect if product/quantity is missing
    }
  }, [product, quantity, navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
          headers: {
            "x-auth-token": token,
          },
        });
        setAddresses(response.data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    fetchAddresses();
  }, []);

  const handleNext = async () => {
    if (activeStep === 1 && !selectedAddress) {
      setError('Please select address!');
      return;
    }

    if (activeStep === 2) {
      try {
        const orderData = {
          quantity,
          product: product.id,
          address: selectedAddress
        };

        await axios.post(
          'https://dev-project-ecommerce.upgrad.dev/api/orders',
          orderData,
          { headers: { "x-auth-token": token } }
        );

        setShowSuccess(true);
        setTimeout(() => {
          navigate("/", { state: { message: "Order placed successfully!" } });
        }, 5000); 
        // alert("Order placed successfully");
      } catch (error) {
        console.error('Error placing order:', error.response?.data || error.message);
        setError('Failed to place order!');
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleAddAddress = async () => {
    const { name, contactNumber, street, city, state, landmark, zipcode } = newAddress;

    // Validate the address form
    if (!name || !contactNumber || !street || !city || !state || !zipcode) {
      setError('Please fill out all required fields!');
      return;
    }

    try {
      const response = await axios.post(
        'https://dev-project-ecommerce.upgrad.dev/api/addresses',
        { name, contactNumber, street, city, state, landmark, zipcode },
        { headers: { "x-auth-token": token } }
      );

      setAddresses([...addresses, response.data]);
      setSelectedAddress(response.data.id);
      setNewAddress({
        name: '', contactNumber: '', street: '', city: '', state: '', landmark: '', zipcode: ''
      });
    } catch (error) {
      console.error('Error adding address:', error.response?.data || error.message);
    }
  };

  const handleAddressChange = (field, value) => {
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Create Order
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && product && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Product Name: {product.name}</Typography>
          <Typography variant="body1">Quantity: {quantity}</Typography>
          <Typography variant="body1">Price: ₹ {product.price * quantity}</Typography>
        </Box>
      )}

      {activeStep === 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Select Address</Typography>
          <TextField
            select
            fullWidth
            label="Select Existing Address"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            sx={{ mb: 2 }}
          >
            {addresses.map((address) => (
              <MenuItem key={address.id} value={address.id}>
                {`${address.name}, ${address.street}, ${address.city}, ${address.state}`}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
            Or Add a New Address:
          </Typography>
          <Box component="form" noValidate sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Name *"
              fullWidth
              value={newAddress.name}
              onChange={(e) => handleAddressChange('name', e.target.value)}
            />
            <TextField
              label="Contact Number *"
              fullWidth
              value={newAddress.contactNumber}
              onChange={(e) => handleAddressChange('contactNumber', e.target.value)}
            />
            <TextField
              label="Street *"
              fullWidth
              value={newAddress.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
            />
            <TextField
              label="City *"
              fullWidth
              value={newAddress.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
            />
            <TextField
              label="State *"
              fullWidth
              value={newAddress.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
            />
            <TextField
              label="Landmark"
              fullWidth
              value={newAddress.landmark}
              onChange={(e) => handleAddressChange('landmark', e.target.value)}
            />
            <TextField
              label="Zip Code *"
              fullWidth
              value={newAddress.zipcode}
              onChange={(e) => handleAddressChange('zipcode', e.target.value)}
            />
            <Button variant="contained" onClick={handleAddAddress}>
              Add Address
            </Button>
          </Box>
        </Box>
      )}

      {activeStep === 2 && (
        <Box sx={{ mt: 4 , display: 'flex', flexDirection:'row'}}>
          <Box sx={{width:500}}>
          <Typography variant="h6">Product Name: {product.name}</Typography>
          <Typography variant="body1">Quantity: {quantity}</Typography>
          <Typography variant="body1">Category: {product.category}</Typography>
          <Typography variant="body1"> {product.description}</Typography>
          <Typography variant="body1">Price: ₹ {product.price * quantity}</Typography>
          </Box>
          <Box>
          <Typography variant="h6">Address Details:</Typography>
          <Typography variant="body1">{addresses.find((addr) => addr.id === selectedAddress).name}</Typography>
          <Typography variant="body1">Contact Number:{addresses.find((addr) => addr.id === selectedAddress).contactNumber}</Typography>
          <Typography variant="body1">{addresses.find((addr) => addr.id === selectedAddress).street},{addresses.find((addr) => addr.id === selectedAddress).city}</Typography>
          <Typography variant="body1">{addresses.find((addr) => addr.id === selectedAddress).state}</Typography>
          <Typography variant="body1">{addresses.find((addr) => addr.id === selectedAddress).zipcode}</Typography>
          {/* <Typography variant="body1">
            Address: {addresses.find((addr) => addr.id === selectedAddress)
              ? `${addresses.find((addr) => addr.id === selectedAddress).name}, 
                ${addresses.find((addr) => addr.id === selectedAddress).street}, 
                ${addresses.find((addr) => addr.id === selectedAddress).city}, 
                ${addresses.find((addr) => addr.id === selectedAddress).state}`
              : 'N/A'}
          </Typography> */}
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prevStep) => prevStep - 1)}
        >
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          {activeStep === 2 ? 'Confirm Order' : 'Next'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

<Snackbar
  open={showSuccess}
  autoHideDuration={3000}
  onClose={() => setShowSuccess(false)}
  anchorOrigin={{ vertical: "top", horizontal: "right" }} // Snackbar at top-right
>
  <Alert
    onClose={() => setShowSuccess(false)}
    severity="success"
    sx={{ backgroundColor: "green", color: "white" }}
  >
    Order placed successfully!
  </Alert>
</Snackbar>
    </Box>
  );
};

export default CreateOrder;