import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Plus, Minus, Tag, CreditCard, ShieldCheck } from "lucide-react";
import { updateQuantity, removeFromCart, applyCoupon, removeCoupon, clearCart } from "../redux/slices/cartSlice";
import { api } from "../services/api";

export default function CartModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, couponCode, subtotal, gst, deliveryCharge, discount, total } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [couponInput, setCouponInput] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [checkingOut, setCheckingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Prepopulate address and phone from user profile
  useEffect(() => {
    if (user) {
      setAddress(user.address || "");
      setPhone(user.phone || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput === "WELCOME10" || couponInput === "FREE20") {
      dispatch(applyCoupon(couponInput));
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid coupon code! Try WELCOME10 or FREE20");
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponInput("");
    setErrorMessage("");
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      onClose();
      navigate("/login");
      return;
    }

    if (!address.trim() || !phone.trim()) {
      setErrorMessage("Please fill in delivery address and phone number.");
      return;
    }

    try {
      setCheckingOut(true);
      setErrorMessage("");

      const payload = {
        items,
        paymentMethod,
        discountCode: couponCode || undefined,
        address,
        phone,
      };

      const result = await api.post("/orders", payload);

      if (result.success) {
        dispatch(clearCart());
        onClose();
        navigate(`/tracking/${result.order._id}`);
      } else {
        setErrorMessage(result.message || "Failed to place order. Try again.");
      }
    } catch (error) {
      setErrorMessage("A checkout network error occurred.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-textLight flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading flex items-center gap-2">
              Shopping Cart 
              <span className="text-sm bg-slate-800 text-accentAmber px-2.5 py-0.5 rounded-full font-sans font-semibold">
                {items.length} Items
              </span>
            </h2>
            <button 
              onClick={onClose}
              className="p-2 text-textGray hover:text-textLight hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                <p className="text-textGray">Your cart is empty.</p>
                <button 
                  onClick={onClose}
                  className="btn-secondary py-2 text-sm"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.foodId}
                  className="flex items-center gap-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-900"
                  />
                  <div className="flex-1">
                    <h4 className="font-heading font-medium text-sm text-textLight line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-textGray mt-0.5">₹{item.price} each</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => dispatch(updateQuantity({ foodId: item.foodId, quantity: Math.max(1, item.quantity - 1) }))}
                        className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-semibold px-2">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(updateQuantity({ foodId: item.foodId, quantity: item.quantity + 1 }))}
                        className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-textLight font-heading">₹{item.price * item.quantity}</p>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.foodId))}
                      className="text-textGray hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 mt-2 transition-all cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Delivery Form (Only if items present) */}
            {items.length > 0 && (
              <div className="border-t border-slate-800/80 pt-5 space-y-4">
                <h3 className="font-heading font-semibold text-sm text-slate-200">Delivery Details</h3>
                
                <div>
                  <label className="text-xs text-textGray font-semibold uppercase tracking-wider block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="input-field py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-textGray font-semibold uppercase tracking-wider block mb-1">Delivery Address</label>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter delivery address"
                    rows={2}
                    className="input-field py-2 text-sm resize-none"
                  />
                </div>

                {/* Coupon input */}
                <div className="pt-2">
                  <label className="text-xs text-textGray font-semibold uppercase tracking-wider block mb-1">Coupon Code</label>
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-500/20 px-3.5 py-2.5 rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                        <Tag className="h-4 w-4" />
                        <span>{couponCode} Applied</span>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input 
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="e.g. WELCOME10"
                        className="input-field py-2 text-sm"
                      />
                      <button 
                        type="submit"
                        className="btn-secondary py-2 text-xs font-semibold px-4 shrink-0 flex items-center gap-1 hover:border-accentAmber hover:text-accentAmber"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  <p className="text-[11px] text-textGray mt-1">Use <span className="text-accentAmber font-semibold">WELCOME10</span> (10% off) or <span className="text-accentAmber font-semibold">FREE20</span> (20% off)</p>
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="text-xs text-textGray font-semibold uppercase tracking-wider block mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Card", "UPI", "COD"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-3 border rounded-xl text-xs font-medium transition-all ${
                          paymentMethod === method
                            ? "bg-accentAmber/10 border-accentAmber text-accentAmber"
                            : "bg-slate-950/40 border-slate-800 text-textGray hover:bg-slate-900"
                        }`}
                      >
                        {method === "COD" ? "Cash on Delivery" : method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Billing Area */}
          {items.length > 0 && (
            <div className="p-6 bg-slate-950 border-t border-slate-850 space-y-4">
              <div className="space-y-1.5 text-sm text-textGray">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-textLight font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="text-textLight font-medium">₹{gst}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="text-textLight font-medium">
                    {deliveryCharge === 0 ? <span className="text-emerald-400">FREE</span> : `₹${deliveryCharge}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-textLight pt-2 border-t border-slate-800 font-heading">
                  <span>Total Amount</span>
                  <span className="text-accentAmber font-heading">₹{total}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-xl">
                  {errorMessage}
                </div>
              )}

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                <CreditCard className="h-4.5 w-4.5" />
                {checkingOut ? (
                  "Processing Order..."
                ) : !isAuthenticated ? (
                  "Sign In to Place Order"
                ) : (
                  `Place Order (₹${total})`
                )}
              </button>
              
              <div className="flex items-center justify-center gap-1 text-[10px] text-textGray">
                <ShieldCheck className="h-3.5 w-3.5 text-accentGreen" />
                <span>Simulated Secure 3D Payment Gateway</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
