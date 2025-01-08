
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Navigationbar';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import { ProductProvider } from './components/ProductContext';
import CreateOrder from './components/CreateOrder';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import DeleteProduct from './components/DeleteProduct';
import Orders from './components/Orders';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(''); 

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(''); 
  };

  return (
    <ProductProvider>
      
        <NavigationBar 
          isLoggedIn={isLoggedIn} 
          userRole={userRole} 
          handleLogout={handleLogout} 
        />
        <Routes>
          <Route path="/" element={<ProductList  isLoggedIn={isLoggedIn} userRole={userRole} />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/order" element={<CreateOrder />} />
          <Route 
            path="/login" 
            element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} 
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-products" element={<AddProduct />} />
          <Route path="/edit-products/:id" element={<EditProduct />} />
          <Route path="/delete-products/:id" element={<DeleteProduct />} />
          <Route path="/orders" element={<Orders isLoggedIn={isLoggedIn} />} />
        </Routes>
    </ProductProvider>
  );
}

export default App;