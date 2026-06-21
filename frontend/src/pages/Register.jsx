import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, UserPlus, Phone, Home, AlertCircle } from "lucide-react";
import { authStart, authSuccess, authFailed } from "../redux/slices/authSlice";
import { api } from "../services/api";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("Customer");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) return;

    try {
      setLoading(true);
      setErrorMsg("");
      dispatch(authStart());

      const result = await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
        address,
        role,
      });

      if (result.success) {
        dispatch(
          authSuccess({
            user: {
              _id: result._id,
              name: result.name,
              email: result.email,
              phone: result.phone,
              role: result.role,
              address: result.address,
            },
            token: result.token,
          })
        );

        if (result.role === "Admin") navigate("/admin");
        else if (result.role === "Chef") navigate("/chef");
        else if (result.role === "Delivery") navigate("/delivery");
        else navigate("/menu");
      } else {
        setErrorMsg(result.message || "Registration failed.");
        dispatch(authFailed(result.message));
      }
    } catch (err) {
      setErrorMsg("Connection error to authentication server.");
      dispatch(authFailed("Connection failure"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md glass-panel p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-heading">Create Account</h2>
          <p className="text-textGray text-sm">Join Aura Dining for food orders & table reservations</p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs px-3.5 py-3 rounded-xl flex items-start gap-2 text-left animate-shake">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div>
            <label className="text-xs text-textGray font-semibold uppercase tracking-wider block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-textGray font-semibold uppercase tracking-wider block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="input-field pl-10 text-sm"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-textGray font-semibold uppercase tracking-wider block mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="input-field pl-10 text-sm"
                />
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="text-xs text-textGray font-semibold uppercase tracking-wider block mb-1">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field text-sm bg-slate-900"
              >
                <option value="Customer">Customer</option>
                <option value="Chef">Chef (Kitchen Staff)</option>
                <option value="Delivery">Delivery Partner</option>
                <option value="Admin">Restaurant Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-textGray font-semibold uppercase tracking-wider block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="input-field pl-10 text-sm"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="text-xs text-textGray font-semibold uppercase tracking-wider block mb-1">Delivery Address</label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, City, Zip"
                className="input-field pl-10 text-sm"
              />
              <Home className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-semibold mt-4"
          >
            <UserPlus className="h-4.5 w-4.5" />
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="border-t border-slate-800/80 pt-5 text-center text-xs text-textGray">
          Already registered?{" "}
          <Link to="/login" className="text-accentAmber font-bold hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
}
