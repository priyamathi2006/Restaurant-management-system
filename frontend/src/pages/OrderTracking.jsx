import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Clock, MapPin, Truck, ChevronRight, CheckCircle2, ShoppingBag } from "lucide-react";
import LiveMap from "../components/LiveMap";
import { setActiveOrder, updateActiveOrderState } from "../redux/slices/orderSlice";
import { connectSocket, getSocket } from "../services/socket";
import { api } from "../services/api";

export default function OrderTracking() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activeOrder } = useSelector((state) => state.order);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const steps = [
    { label: "Pending", desc: "Awaiting confirmation", status: "Pending" },
    { label: "Accepted", desc: "Confirmed by restaurant", status: "Accepted" },
    { label: "Preparing", desc: "Chef is cooking your meal", status: "Preparing" },
    { label: "Ready", desc: "Awaiting driver pick up", status: "Ready" },
    { label: "Out For Delivery", desc: "Rider is heading to you", status: "OutForDelivery" },
    { label: "Delivered", desc: "Enjoy your meal!", status: "Delivered" },
  ];

  const getStepIndex = (status) => {
    return steps.findIndex((step) => step.status === status);
  };

  const activeIndex = activeOrder ? getStepIndex(activeOrder.orderStatus) : 0;

  // Fetch initial order details
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      if (res.success) {
        dispatch(setActiveOrder(res.order));
      } else {
        setError(res.message || "Failed to load order.");
      }
    } catch (err) {
      setError("Network error loading order tracking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  // Handle Socket.io real-time updates
  useEffect(() => {
    if (!user || !id) return;

    // Connect socket
    const socket = connectSocket(user._id, user.role);

    if (socket) {
      // Listen to order updates
      socket.on("orderUpdate", (updatedOrder) => {
        if (updatedOrder._id === id) {
          dispatch(updateActiveOrderState(updatedOrder));
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("orderUpdate");
      }
    };
  }, [user, id]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-textGray">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accentAmber mr-3"></div>
        Connecting to live tracking channels...
      </div>
    );
  }

  if (error || !activeOrder) {
    return (
      <div className="max-w-md mx-auto my-16 glass-panel p-8 text-center space-y-4">
        <div className="bg-red-500/10 p-3 rounded-full text-red-400 w-fit mx-auto">
          ✕
        </div>
        <h3 className="font-heading font-bold text-lg">Tracking Unavailable</h3>
        <p className="text-textGray text-sm">{error || "The requested order could not be located."}</p>
        <Link to="/menu" className="btn-primary inline-block text-xs py-2 px-6">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
      {/* Tracker & Timeline Details */}
      <div className="lg:col-span-2 space-y-8">
        <div className="glass-panel p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap justify-between items-start border-b border-slate-800/80 pb-5 gap-4">
            <div>
              <p className="text-xs text-textGray uppercase tracking-wider font-semibold">Order Tracking ID</p>
              <h1 className="text-xl font-bold text-slate-100 mt-1 flex items-center gap-2">
                #{activeOrder._id}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-xs text-textGray uppercase tracking-wider font-semibold font-sans">Payment Method</p>
              <p className="text-sm font-bold text-textLight mt-1">{activeOrder.paymentMethod} ({activeOrder.paymentStatus})</p>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest">Order Progress</h3>
            
            {/* Visual Progress Bar (Horizontal for desktops, vertical for mobiles) */}
            <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-2">
              {/* Background Line */}
              <div className="absolute left-[17px] sm:left-0 top-0 sm:top-[17px] w-0.5 sm:w-full h-full sm:h-0.5 bg-slate-800 z-0" />
              {/* Active colored line */}
              <div 
                className="absolute left-[17px] sm:left-0 top-0 sm:top-[17px] w-0.5 sm:h-0.5 bg-accentAmber transition-all duration-500 z-0" 
                style={{ 
                  height: window.innerWidth < 640 ? `${(activeIndex / (steps.length - 1)) * 100}%` : "auto",
                  width: window.innerWidth >= 640 ? `${(activeIndex / (steps.length - 1)) * 100}%` : "auto"
                }}
              />

              {steps.map((step, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={idx} className="flex sm:flex-col items-center gap-4 sm:gap-2 z-10 w-full sm:w-fit text-left sm:text-center">
                    <div 
                      className={`h-9 w-9 rounded-full flex items-center justify-center border transition-all ${
                        isCurrent 
                          ? "bg-slate-900 border-accentAmber text-accentAmber scale-110 shadow-glow" 
                          : isPassed
                          ? "bg-accentAmber border-accentAmber text-white" 
                          : "bg-slate-900 border-slate-850 text-slate-500"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-5 w-5 fill-current stroke-slate-900" /> : <span className="text-xs font-bold font-sans">{idx + 1}</span>}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isPassed ? "text-textLight" : "text-textGray"}`}>{step.label}</p>
                      <p className="text-[10px] text-textGray leading-relaxed max-w-[100px] hidden sm:block mx-auto mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Map Widget */}
        <LiveMap orderStatus={activeOrder.orderStatus} />
      </div>

      {/* Summary Box & Details Sidebar */}
      <div className="space-y-6">
        {/* Order Details List */}
        <div className="glass-panel p-6 space-y-5">
          <h3 className="font-heading font-bold text-lg text-textLight">Receipt Summary</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {activeOrder.items?.map((item) => (
              <div key={item.foodId} className="flex gap-3 justify-between items-center text-xs">
                <div className="flex gap-2.5 items-center">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover bg-slate-900" />
                  <div>
                    <p className="font-bold text-slate-200 line-clamp-1">{item.name}</p>
                    <p className="text-textGray">₹{item.price} x {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-textLight">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-4 space-y-1.5 text-xs text-textGray">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-textLight">₹{activeOrder.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="text-textLight">₹{activeOrder.gst}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery charge</span>
              <span className="text-textLight">
                {activeOrder.deliveryCharge === 0 ? "FREE" : `₹${activeOrder.deliveryCharge}`}
              </span>
            </div>
            {activeOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Coupon Applied</span>
                <span>-₹{activeOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-accentAmber pt-2 border-t border-slate-800 font-heading">
              <span>Grand Total</span>
              <span>₹{activeOrder.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Contact/Driver Details */}
        <div className="glass-panel p-6 space-y-4 text-sm">
          <h3 className="font-heading font-bold text-base text-textLight">Delivery Details</h3>
          
          <div className="space-y-3 text-xs text-textGray">
            <div>
              <p className="font-semibold uppercase text-[10px] text-textGray">Recipient Contact</p>
              <p className="text-textLight font-medium mt-1">{activeOrder.userId?.name} ({activeOrder.phone})</p>
            </div>
            <div>
              <p className="font-semibold uppercase text-[10px] text-textGray">Shipping Location</p>
              <p className="text-textLight leading-relaxed mt-1 flex items-start gap-1">
                <MapPin className="h-4 w-4 shrink-0 text-accentOrange mt-0.5" />
                <span>{activeOrder.address}</span>
              </p>
            </div>
            {activeOrder.deliveryPartner ? (
              <div className="border-t border-slate-850 pt-3 flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-xl text-accentAmber">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold uppercase text-[10px] text-textGray">Delivery Rider</p>
                  <p className="text-textLight font-bold text-sm mt-0.5">{activeOrder.deliveryPartner.name}</p>
                  <p className="text-textGray mt-0.5">{activeOrder.deliveryPartner.phone}</p>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-850 pt-3 text-xs text-textGray italic">
                Rider will be assigned as soon as the kitchen prepares your items.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
