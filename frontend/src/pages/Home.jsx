import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Calendar, Truck, Clock, ShieldCheck, Star, X, MapPin, ExternalLink } from "lucide-react";
import { api } from "../services/api";

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const res = await api.get("/orders/myorders");
          if (res.success) {
            setOrders(res.orders);
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [modalOpen]);

  const activeOrder = orders.find((o) =>
    ["Accepted", "Preparing", "Ready", "OutForDelivery"].includes(o.orderStatus)
  );

  const features = [
    {
      icon: <Clock className="h-6 w-6 text-accentAmber" />,
      title: "Real-Time Tracking",
      desc: "Watch your meal travel from our kitchen to your plate with live Socket.io updates and scooter tracking.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-accentAmber" />,
      title: "Instant Table Bookings",
      desc: "Reserve your preferred table visually with our custom interactive restaurant seating map simulator.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-accentAmber" />,
      title: "Secure Checkouts",
      desc: "Simulated instant payments support via Cards, UPI gateways, or standard Cash on Delivery.",
    },
  ];

  const signatures = [
    {
      name: "Rich Butter Chicken",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60",
      price: "₹450",
      rating: "4.9",
      desc: "Tender tandoori chicken simmered in smooth butter-tomato gravy.",
    },
    {
      name: "Chocolate Lava Cake",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60",
      price: "₹240",
      rating: "4.9",
      desc: "Decadent sponge cake filled with hot molten dark chocolate.",
    },
    {
      name: "Tandoori Paneer Tikka",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=60",
      price: "₹280",
      rating: "4.8",
      desc: "Skewered cottage cheese cubes char-grilled with mixed spices.",
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Area */}
          <div className="space-y-6 text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading leading-tight">
              <span className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#AA7C11] bg-clip-text text-transparent">
                Dining Begins <br />
                Before The First Bite
              </span>
            </h1>
            <p className="text-slate-800 text-base sm:text-lg leading-relaxed max-w-md font-medium">
              Order fresh food, reserve visual tables, and trace your delivery rider in real-time. Welcome to Aura Dining, the ultimate smart restaurant system.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/menu" className="btn-primary flex items-center gap-2">
                Explore Menu
                <ShoppingBag className="h-4.5 w-4.5" />
              </Link>
              <Link to="/reservation" className="btn-secondary flex items-center gap-2">
                Book Table
                <Calendar className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>

          {/* Image Area */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl animate-spin-slow">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80" 
                alt="Delicious Gourmet Platter"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Absolute Badges */}
            <button 
              onClick={() => setModalOpen(true)}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 lg:-bottom-6 lg:-left-12 lg:translate-x-0 cursor-pointer hover:scale-105 active:scale-95 hover:border-accentAmber/40 hover:shadow-glow/10 transition-all duration-300 bg-slate-900/95 border border-slate-850 p-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md z-10 text-left animate-pulse hover:animate-none"
            >
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-textGray font-semibold">Fast Shipping</p>
                <p className="text-sm font-bold text-textLight">Real-Time Tracked</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold font-heading">Operational Automations</h2>
          <p className="text-slate-700 text-sm font-medium">Automating restaurant ordering workflows and reservation lists using real-time Socket communication.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="glass-panel p-8 space-y-4 text-left border border-slate-800/80">
              <div className="p-3 bg-slate-800/60 rounded-xl w-fit">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold font-heading text-textLight">{f.title}</h3>
              <p className="text-textGray text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signature Specials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="text-left space-y-2">
            <h2 className="text-3xl font-bold font-heading">Chef's Signature Specials</h2>
            <p className="text-slate-700 text-sm font-medium">A handpicked selection of our most appreciated dishes, prepared fresh every day.</p>
          </div>
          <Link to="/menu" className="text-accentAmber hover:text-accentOrange flex items-center gap-1 font-semibold text-sm hover:underline">
            View Full Menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signatures.map((s, idx) => (
            <div key={idx} className="glass-card flex flex-col overflow-hidden text-left hover:shadow-glow/10">
              <div className="h-56 overflow-hidden">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold font-heading text-textLight">{s.name}</h3>
                    <div className="flex items-center gap-0.5 text-accentAmber text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{s.rating}</span>
                    </div>
                  </div>
                  <p className="text-textGray text-sm leading-relaxed">{s.desc}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800/60">
                  <span className="text-lg font-bold font-heading text-textLight">{s.price}</span>
                  <Link to="/menu" className="text-accentAmber text-xs font-bold uppercase hover:underline">Order Now</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real-Time Order Tracking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-textGray hover:text-textLight p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accentAmber/10 rounded-2xl text-accentAmber animate-bounce">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-textLight">Live Order Tracking</h3>
                <p className="text-xs text-textGray">Real-time status updates via WebSockets</p>
              </div>
            </div>

            {/* Modal Body */}
            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-accentAmber"></div>
                <p className="text-sm text-textGray font-semibold">Checking your order status...</p>
              </div>
            ) : activeOrder ? (
              <div className="space-y-4">
                <div className="bg-slate-850/60 border border-slate-800 p-4 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-accentAmber tracking-wider">Active Order</p>
                      <p className="text-sm font-bold text-textLight mt-0.5">Order #{activeOrder._id.slice(-8)}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-accentAmber/10 border border-accentAmber/20 text-accentAmber">
                      {activeOrder.orderStatus}
                    </span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="pt-2">
                    <div className="relative flex justify-between text-xs">
                      {/* Line */}
                      <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-slate-800 -z-10"></div>
                      <div 
                        className="absolute top-2.5 left-0 h-0.5 bg-accentAmber -z-10 transition-all duration-500"
                        style={{
                          width: activeOrder.orderStatus === "Accepted" ? "0%" :
                                 activeOrder.orderStatus === "Preparing" ? "33%" :
                                 activeOrder.orderStatus === "Ready" ? "66%" : "100%"
                        }}
                      ></div>
                      
                      {/* Nodes */}
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          ["Accepted", "Preparing", "Ready", "OutForDelivery"].includes(activeOrder.orderStatus)
                            ? "bg-accentAmber border-accentAmber" : "bg-slate-900 border-slate-800"
                        }`}></div>
                        <span className="text-[9px] mt-1.5 text-textGray font-semibold">Accepted</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          ["Preparing", "Ready", "OutForDelivery"].includes(activeOrder.orderStatus)
                            ? "bg-accentAmber border-accentAmber" : "bg-slate-900 border-slate-800"
                        }`}></div>
                        <span className="text-[9px] mt-1.5 text-textGray font-semibold">Preparing</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          ["Ready", "OutForDelivery"].includes(activeOrder.orderStatus)
                            ? "bg-accentAmber border-accentAmber" : "bg-slate-900 border-slate-800"
                        }`}></div>
                        <span className="text-[9px] mt-1.5 text-textGray font-semibold">Ready</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          activeOrder.orderStatus === "OutForDelivery"
                            ? "bg-accentAmber border-accentAmber" : "bg-slate-900 border-slate-800"
                        }`}></div>
                        <span className="text-[9px] mt-1.5 text-textGray font-semibold">Out for Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Link 
                    to={`/tracking/${activeOrder._id}`}
                    onClick={() => setModalOpen(false)}
                    className="btn-primary w-full py-3 text-center font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-accentAmber/10 hover:shadow-glow/15"
                  >
                    Track Live on Map
                    <MapPin className="h-4 w-4" />
                  </Link>
                  <button 
                    onClick={() => setModalOpen(false)}
                    className="w-full py-2.5 text-center text-xs font-semibold text-textGray hover:text-textLight hover:bg-slate-850 rounded-xl transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="bg-slate-850/40 border border-slate-850/60 p-5 rounded-2xl text-center space-y-3">
                  <p className="text-sm text-textGray leading-relaxed">
                    You don't have any active delivery orders right now.
                  </p>
                  
                  {orders.length > 0 && (
                    <div className="pt-3 border-t border-slate-800/60 text-left">
                      <p className="text-[10px] text-textGray uppercase font-bold tracking-wider mb-2">Recent Order</p>
                      <Link 
                        to={`/tracking/${orders[0]._id}`}
                        onClick={() => setModalOpen(false)}
                        className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-850 hover:border-accentAmber/40 hover:bg-slate-900/80 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer block"
                      >
                        <div>
                          <p className="text-xs font-semibold text-textLight flex items-center gap-1">
                            Order #{orders[0]._id.slice(-8)}
                            <ExternalLink className="h-3 w-3 text-textGray" />
                          </p>
                          <p className="text-[10px] text-textGray">{new Date(orders[0].createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                          {orders[0].orderStatus}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link 
                    to="/menu"
                    onClick={() => setModalOpen(false)}
                    className="btn-primary py-2.5 text-center text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Order Food
                  </Link>
                  <Link 
                    to="/myorders"
                    onClick={() => setModalOpen(false)}
                    className="btn-secondary py-2.5 text-center text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    Order History
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
