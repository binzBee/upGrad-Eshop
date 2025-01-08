import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const Orders = ({isLoggedIn}) => {
    const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTczNDI1NDg4NywiZXhwIjoxNzM0MjYzMjg3fQ.3NNw9spqv5DwiQJqD__JeyqUQPeskr26diN2Nq0rIS_bN-gCUtXcbcGBFrtjUZ9ej63p_IlB0T7HAdbbpBwcMA";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://dev-project-ecommerce.upgrad.dev/api/orders`,
          {
            headers: { "x-auth-token": token },
          }
        );

        const ordersWithProducts = await Promise.all(
          response.data.map(async (order) => {
            try {
              const productResponse = await axios.get(
                `https://dev-project-ecommerce.upgrad.dev/api/products/${order.product}`
              );
              return {
                ...order,
                productDetails: productResponse.data,
              };
            } catch (error) {
              console.error(`Failed to fetch product ${order.product}:`, error);
              return { ...order, productDetails: null };
            }
          })
        );

        setOrders(ordersWithProducts);
      } catch (error) {
        console.error('Error fetching orders:', error.response?.data || error.message);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (!isLoggedIn) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error">Please Login to view products</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '900px', mx: 'auto', mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Orders List
      </Typography>

      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && orders.length === 0 && (
        <Typography>No orders found.</Typography>
      )}

      {!loading && orders.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Total Price</strong></TableCell>
                <TableCell><strong>Order Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.productDetails?.name || 'Product Not Found'}
                  </TableCell>
                  <TableCell>{order.quantity || 'N/A'}</TableCell>
                  <TableCell>
                    ₹ {order.productDetails?.price && order.quantity
                      ? order.productDetails.price * order.quantity
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Orders;