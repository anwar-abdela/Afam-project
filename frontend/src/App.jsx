import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import StoreLayout from './layouts/StoreLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Savings from './pages/Savings';
import Reports from './pages/Reports';
import Categories from './pages/Categories';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background-light font-black text-primary-500 italic uppercase">Loading System...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Store Routes */}
                <Route element={<StoreLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                {/* Protected Management Routes - Restored to Root Paths */}
                <Route element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/savings" element={<Savings />} />
                    <Route path="/reports" element={<Reports />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
