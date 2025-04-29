// src/pages/AdminPanel.jsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminCars from '../components/admin/AdminCars';
import AdminUsers from '../components/admin/AdminUsers';
import AdminListings from '../components/admin/AdminListings';
import AdminBlogs from '../components/admin/AdminBlogs';
import '../styles/pages/AdminPanel.css';

const AdminPanel = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('cars');

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <div className="admin-container">
        <h1>Панель администратора</h1>
        
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'cars' ? 'active' : ''}`}
            onClick={() => setActiveTab('cars')}
          >
            Автомобили
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Пользователи
          </button>
          <button 
            className={`tab-button ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            Объявления
          </button>
          <button 
            className={`tab-button ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            Блоги
          </button>
        </div>
        
        {/* Render component based on active tab */}
        {activeTab === 'cars' && <AdminCars />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'listings' && <AdminListings />}
        {activeTab === 'blogs' && <AdminBlogs />}
      </div>
      <Footer />
    </>
  );
};

export default AdminPanel;