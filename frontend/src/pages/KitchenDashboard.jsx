import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChefHat, Bell, CheckCircle2, Flame, RotateCw, AlertCircle } from "lucide-react";
import { setOrders, addNewOrderToList, updateActiveOrderState } from "../redux/slices/orderSlice";
import { connectSocket } from "../services/socket";
import { api } from "../services/api";

export default function KitchenDashboard() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("cooking"); // "cooking" (Pending, Accepted, Preparing) vs "ready" (Ready, OutForDelivery, Delivered)

  // Use Web Audio API to play a synthesised notification chime when new orders arrive
  const playNewOrderChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // First Tone
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain1.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.3);

      // Second Tone (slight delay)
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime); // A5
        gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.5);
      }, 150);

    } catch (e) {
      console.log("Audio play blocked by browser policies.");
    }
  };

  const fetchOrders = async () => {
    try {
      dispatch(orderActionStart());
      const res = await api.get("/orders");
      if (res.success) {
        dispatch(setOrders(res.orders));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Redux action mock to replace createAsyncThunk for loading state toggling
  const orderActionStart = () => ({ type: "order/orderActionStart" });

  useEffect(() => {
    fetchOrders();
  }, []);

  // WebSockets synchronization
  useEffect(() => {
    if (!user) return;
    const socket = connectSocket(user._id, user.role);

    if (socket) {
      // Listen to status changes made by others
      socket.on("orderStatusChange", (updatedOrder) => {
        dispatch(updateActiveOrderState(updatedOrder));
      });

      // Listen for newly placed orders
      socket.on("newOrder", (newOrder) => {
        dispatch(addNewOrderToList(newOrder));
        playNewOrderChime();
      });
    }

    return () => {
      if (socket) {
        socket.off("orderStatusChange");
        socket.off("newOrder");
      }
    };
  }, [user]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.success) {
        dispatch(updateActiveOrderState(res.order));
      } else {
        alert(res.message || "Failed to update order status.");
      }
    } catch (err) {
      alert("Error contacting the chef server.");
    }
  };

  const activeChefOrders = orders.filter((o) => 
    activeTab === "cooking"
      ? ["Pending", "Accepted", "Preparing"].includes(o.orderStatus)
      : ["Ready", "OutForDelivery", "Delivered"].includes(o.orderStatus)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-heading flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-accentAmber" />
            Kitchen Order Queue
          </h1>
          <p className="text-textGray text-sm">Real-time status coordination dashboard for kitchen staff & chefs.</p>
        </div>
        
        <button 
          onClick={playNewOrderChime}
          className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 hover:text-accentAmber hover:border-accentAmber"
          title="Test audio chime synthesiser"
        >
          <Bell className="h-4 w-4" /> Test Bell Sound
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("cooking")}
          className={`py-3 px-6 font-heading font-medium text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "cooking"
              ? "border-accentAmber text-accentAmber font-bold"
              : "border-transparent text-textGray hover:text-textLight"
          }`}
        >
          Preparation Queue (Active)
        </button>
        <button
          onClick={() => setActiveTab("ready")}
          className={`py-3 px-6 font-heading font-medium text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "ready"
              ? "border-accentGreen text-accentGreen font-bold"
              : "border-transparent text-textGray hover:text-textLight"
          }`}
        >
          Completed / Shipping
        </button>
      </div>

      {/* Main Panel grid */}
      {activeChefOrders.length === 0 ? (
        <div className="glass-panel p-16 text-center text-textGray text-sm">
          No orders are currently waiting in this section. Good job!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeChefOrders.map((order) => (
            <div 
              key={order._id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xl"
            >
              {/* Order Metadata */}
              <div className="p-5 border-b border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-sm text-textLight">Order #{order._id.substring(order._id.length - 8)}</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    order.orderStatus === "Pending" 
                      ? "bg-slate-800 border-slate-750 text-slate-400" 
                      : order.orderStatus === "Accepted"
                      ? "bg-amber-950/20 border-amber-500/20 text-accentAmber"
                      : order.orderStatus === "Preparing"
                      ? "bg-blue-950/20 border-blue-500/20 text-blue-400"
                      : "bg-emerald-950/20 border-emerald-500/20 text-accentGreen"
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
                
                <p className="text-[11px] text-textGray">
                  Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000)} mins ago)
                </p>
              </div>

              {/* Items List */}
              <div className="p-5 space-y-3 flex-grow">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-350 font-medium">{item.name} <strong className="text-accentAmber">x{item.quantity}</strong></span>
                    <span className="text-[10px] text-textGray bg-slate-950 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                  </div>
                ))}
                
                {order.specialRequests && (
                  <div className="bg-amber-950/10 border border-amber-500/10 p-2.5 rounded-lg text-[11px] text-accentAmber flex items-start gap-1">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>Req: "{order.specialRequests}"</span>
                  </div>
                )}
              </div>

              {/* Chef status actions */}
              <div className="p-5 bg-slate-950/40 border-t border-slate-800/80">
                {order.orderStatus === "Pending" && (
                  <button
                    onClick={() => updateStatus(order._id, "Accepted")}
                    className="w-full btn-secondary text-xs font-semibold py-2 cursor-pointer hover:border-accentAmber hover:text-accentAmber"
                  >
                    Accept Order
                  </button>
                )}
                
                {order.orderStatus === "Accepted" && (
                  <button
                    onClick={() => updateStatus(order._id, "Preparing")}
                    className="w-full btn-primary text-xs font-semibold py-2 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Flame className="h-3.5 w-3.5" />
                    Start Cooking
                  </button>
                )}
                
                {order.orderStatus === "Preparing" && (
                  <button
                    onClick={() => updateStatus(order._id, "Ready")}
                    className="w-full btn-success text-xs font-semibold py-2 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark Ready for Pickup
                  </button>
                )}

                {["Ready", "OutForDelivery", "Delivered"].includes(order.orderStatus) && (
                  <div className="text-[11px] text-textGray italic text-center">
                    Chef operations complete. Order status is now managed by logistics partners.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
