import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut, Utensils, Calendar, Shield, LayoutDashboard, Menu, X } from "lucide-react";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";

export default function Navbar({ onOpenCart }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "Admin":
        return "/admin";
      case "Chef":
        return "/chef";
      case "Delivery":
        return "/delivery";
      default:
        return "/";
    }
  };

  return (
    <nav className="glass-panel rounded-none border-t-0 border-x-0 sticky top-0 z-50 bg-darkBg/90 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="p-2 bg-gradient-to-tr from-accentAmber to-accentOrange rounded-xl shadow-glow text-white">
                <Utensils className="h-6 w-6" />
              </span>
              <span className="font-heading font-bold text-2xl tracking-tight bg-gradient-to-r from-textLight to-slate-300 bg-clip-text text-transparent">
                Aura<span className="text-accentAmber"> Dining</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-textGray hover:text-accentAmber transition-colors font-medium">Home</Link>
            <Link to="/menu" className="text-textGray hover:text-accentAmber transition-colors font-medium">Menu</Link>
            <Link to="/reservation" className="text-textGray hover:text-accentAmber transition-colors font-medium">Book Table</Link>

            {isAuthenticated && user?.role === "Customer" && (
              <Link to="/myorders" className="text-textGray hover:text-accentAmber transition-colors font-medium">My Orders</Link>
            )}

            {isAuthenticated && user?.role !== "Customer" && (
              <Link to={getDashboardPath()} className="flex items-center gap-1.5 text-accentAmber hover:text-accentOrange transition-colors font-semibold">
                <LayoutDashboard className="h-4 w-4" />
                Staff Dashboard
              </Link>
            )}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            {(!isAuthenticated || user?.role === "Customer") && (
              <button
                onClick={onOpenCart}
                className="relative p-2.5 text-textGray hover:text-accentAmber hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accentOrange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 border-l border-slate-700/60 pl-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-textLight">{user.name}</p>
                  <p className="text-[11px] text-textGray uppercase tracking-wider font-semibold">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-textGray hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary flex items-center gap-1.5">
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-textGray hover:text-textLight focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800/80 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-textGray hover:text-textLight hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-textGray hover:text-textLight hover:bg-slate-800"
          >
            Menu
          </Link>
          <Link
            to="/reservation"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-textGray hover:text-textLight hover:bg-slate-800"
          >
            Book Table
          </Link>

          {isAuthenticated && user?.role === "Customer" && (
            <Link
              to="/myorders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-textGray hover:text-textLight hover:bg-slate-800"
            >
              My Orders
            </Link>
          )}

          {isAuthenticated && user?.role !== "Customer" && (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-accentAmber hover:bg-slate-800"
            >
              Dashboard ({user.role})
            </Link>
          )}

          <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-accentAmber">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-textLight">{user.name}</p>
                    <p className="text-xs text-textGray">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full btn-primary text-center flex justify-center items-center gap-1.5"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
