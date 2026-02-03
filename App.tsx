import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './screens/Login';
import Home from './screens/Home';
import Budget from './screens/Budget';
import Transactions from './screens/Transactions';
import AddTransaction from './screens/AddTransaction';

const Layout: React.FC = () => {
  const location = useLocation();
  // Hide navbar on login, add, and edit screens
  const hideNavbarRoutes = ['/', '/login', '/add'];
  // We check if the path starts with /edit for dynamic routes
  const isEditRoute = location.pathname.startsWith('/edit');
  
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname) && !isEditRoute;

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/add" element={<AddTransaction />} />
        <Route path="/edit/:id" element={<AddTransaction />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {shouldShowNavbar && <Navbar />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
};

export default App;