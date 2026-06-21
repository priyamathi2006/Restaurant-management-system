import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartModal from "./components/CartModal";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";
import OrderTracking from "./pages/OrderTracking";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import KitchenDashboard from "./pages/KitchenDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleOpenCart = () => setCartOpen(true);
    window.addEventListener("open-cart", handleOpenCart);
    return () => window.removeEventListener("open-cart", handleOpenCart);
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navigation Header */}
        <Navbar onOpenCart={() => setCartOpen(true)} />

        {/* Sliding Sidebar Shopping Cart */}
        <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

        {/* Main Routed Page Body */}
        <main className="flex-grow">
          <Routes>
            {/* Public Customer Routes */}
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Customer Routes */}
            <Route
              path="/myorders"
              element={
                <ProtectedRoute allowedRoles={["Customer"]}>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking/:id"
              element={
                <ProtectedRoute allowedRoles={["Customer", "Admin", "Delivery"]}>
                  <OrderTracking />
                </ProtectedRoute>
              }
            />

            {/* Role-Based Protected Staff Dashboards */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chef"
              element={
                <ProtectedRoute allowedRoles={["Chef"]}>
                  <KitchenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery"
              element={
                <ProtectedRoute allowedRoles={["Delivery"]}>
                  <DeliveryDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}
