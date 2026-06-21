import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Calendar, Truck, Clock, ShieldCheck, Star } from "lucide-react";

export default function Home() {
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
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-accentAmber/10 text-accentAmber border border-accentAmber/20 uppercase tracking-widest">
              Gourmet Experience Redefined
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading leading-tight">
              Flavors that <br />
              <span className="bg-gradient-to-r from-accentAmber via-accentOrange to-orange-500 bg-clip-text text-transparent glow-text">
                Mesmerize Your Senses
              </span>
            </h1>
            <p className="text-textGray text-base sm:text-lg leading-relaxed max-w-md">
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
            <div className="absolute -bottom-4 left-6 bg-slate-900/95 border border-slate-850 p-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-textGray font-semibold">Fast Shipping</p>
                <p className="text-sm font-bold text-textLight">Real-Time Tracked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold font-heading">Operational Automations</h2>
          <p className="text-textGray text-sm">Automating restaurant ordering workflows and reservation lists using real-time Socket communication.</p>
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
            <p className="text-textGray text-sm">A handpicked selection of our most appreciated dishes, prepared fresh every day.</p>
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
    </div>
  );
}
