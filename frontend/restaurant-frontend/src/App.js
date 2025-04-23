import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SuperAdminRegister from './components/SuperAdminRegister';
import SuperAdminLogin from './components/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import RestaurantRegister from './components/RestaurantRegister';
import RestaurantLogin from './components/RestaurantLogin';
import RestaurantDashboard from './pages/RestaurantDashboard';
import IndexPage from './components/IndexPage';











function App() {
  return (
    <Routes>
      <Route path="/superadmin/register" element={<SuperAdminRegister />} />
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />
      <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
      <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
      <Route path="/restaurant/register" element={<RestaurantRegister />} />
      <Route path="/restaurant/login" element={<RestaurantLogin />} />
      <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
      <Route path="/" element={<IndexPage />} />
      
    
      
      
      

     
     
      

    </Routes>
  );
}

export default App;
