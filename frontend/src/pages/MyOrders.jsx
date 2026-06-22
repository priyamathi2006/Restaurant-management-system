import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Eye, ShoppingBag } from "lucide-react";
import { api } from "../services/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/myorders");
      if (res.success) {
        setOrders(res.orders);
      } else {
        setError(res.message || "Failed to load orders.");
      }
    } catch (err) {
      setError("Network error fetching order history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-950/30 border-emerald-500/25 text-emerald-400";
      case "OutForDelivery":
        return "bg-purple-950/30 border-purple-500/25 text-purple-400";
      case "Ready":
        return "bg-teal-950/30 border-teal-500/25 text-teal-400";
      case "Preparing":
        return "bg-blue-950/30 border-blue-500/25 text-blue-400";
      case "Accepted":
        return "bg-amber-950/30 border-amber-500/25 text-accentAmber";
      default:
        return "bg-slate-800 border-slate-700 text-slate-400";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold font-heading">My Orders</h1>
        <p className="text-slate-600 text-sm">Review your dining and delivery history, verify payment summaries, or track current active orders.</p>
      </div>

      {loading ? (
        <div className="h-60 flex items-center justify-center text-slate-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accentAmber mr-3"></div>
          Fetching your orders history...
        </div>
      ) : error ? (
        <div className="glass-panel p-12 text-center text-red-400 text-sm">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel p-16 text-center space-y-4 max-w-md mx-auto">
          <ShoppingBag className="h-12 w-12 text-slate-650 mx-auto" />
          <h3 className="font-heading font-bold text-lg">No Orders Placed</h3>
          <p className="text-textGray text-xs">You haven't placed any orders yet. Visit our food catalog to get started!</p>
          <Link to="/menu" className="btn-primary inline-block text-xs py-2 px-6">Explore Menu</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-heading font-bold text-slate-200">Order #{order._id}</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusStyle(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-textGray">
                  {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-slate-350 line-clamp-1 max-w-lg mt-1">
                  Items: {order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
                </p>
              </div>

              <div className="flex sm:flex-col items-end gap-3 sm:gap-1.5 w-full sm:w-fit justify-between sm:justify-center border-t border-slate-850 sm:border-t-0 pt-3 sm:pt-0">
                <span className="font-heading font-extrabold text-textLight text-lg">₹{order.totalAmount}</span>
                <Link 
                  to={`/tracking/${order._id}`}
                  className="btn-secondary py-1.5 px-4 text-xs font-semibold flex items-center gap-1 hover:text-accentAmber hover:border-accentAmber"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Track Live
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
