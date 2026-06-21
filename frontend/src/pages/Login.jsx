import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, UserCheck, AlertTriangle } from "lucide-react";
import { authStart, authSuccess, authFailed } from "../redux/slices/authSlice";
import { api } from "../services/api";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Forgot Password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1 = input email, 2 = display OTP & enter new password
  const [mockOtp, setMockOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetUserId, setResetUserId] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      setErrorMsg("");
      dispatch(authStart());

      const result = await api.post("/auth/login", { email, password });

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

        // Redirect based on role
        if (result.role === "Admin") navigate("/admin");
        else if (result.role === "Chef") navigate("/chef");
        else if (result.role === "Delivery") navigate("/delivery");
        else navigate("/menu");
      } else {
        setErrorMsg(result.message || "Invalid credentials.");
        dispatch(authFailed(result.message));
      }
    } catch (err) {
      setErrorMsg("Connection failure to the auth server.");
      dispatch(authFailed("Connection failure"));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { email: forgotEmail });
      if (res.success) {
        setMockOtp(res.otp);
        setResetUserId(res.userId);
        setForgotStep(2);
      } else {
        alert(res.message || "User not found.");
      }
    } catch (err) {
      alert("Failed to connect for password reset.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (otpInput !== mockOtp) {
      alert("Invalid OTP code! Check the code displayed in the alert.");
      return;
    }

    try {
      const res = await api.post("/auth/reset-password", {
        userId: resetUserId,
        password: newPassword,
      });

      if (res.success) {
        alert("Password reset successfully! You can now log in.");
        setForgotOpen(false);
        setForgotStep(1);
        setForgotEmail("");
        setOtpInput("");
        setNewPassword("");
      } else {
        alert("Password reset failed.");
      }
    } catch (err) {
      alert("Reset password connection error.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md glass-panel p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-heading">Welcome Back</h2>
          <p className="text-textGray text-sm">Log in to manage your orders & reservations</p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs px-3.5 py-3 rounded-xl flex items-start gap-2 text-left">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="text-xs text-textGray font-semibold uppercase tracking-wider block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="input-field pl-10 text-sm"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-textGray font-semibold uppercase tracking-wider block">Password</label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-xs text-accentAmber hover:underline hover:text-accentOrange cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10 text-sm"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-semibold mt-4"
          >
            <UserCheck className="h-4.5 w-4.5" />
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="border-t border-slate-800/80 pt-5 text-center text-xs text-textGray">
          Don't have an account?{" "}
          <Link to="/register" className="text-accentAmber font-bold hover:underline">
            Register Here
          </Link>
        </div>

        {/* Developer Seeding helper */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-left space-y-1.5 text-xs text-textGray">
          <p className="font-bold text-slate-300">Default Accounts (Seed):</p>
          <p>• Admin: <code className="text-accentAmber">admin@restaurant.com</code> / <code className="text-slate-300">admin123</code></p>
          <p>• Chef: <code className="text-accentAmber">chef@restaurant.com</code> / <code className="text-slate-300">chef123</code></p>
          <p>• Rider: <code className="text-accentAmber">delivery@restaurant.com</code> / <code className="text-slate-300">delivery123</code></p>
          <p>• User: <code className="text-accentAmber">customer@restaurant.com</code> / <code className="text-slate-300">customer123</code></p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4 text-left">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-lg text-textLight">Reset Password</h3>
              <button onClick={() => setForgotOpen(false)} className="text-textGray hover:text-white">✕</button>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-textGray">Enter your email address to receive a validation OTP. (Simulated in next step)</p>
                <div>
                  <label className="text-xs text-textGray uppercase font-bold block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="input-field text-sm"
                  />
                </div>
                <button type="submit" className="w-full btn-primary text-sm py-2">
                  Request OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="bg-emerald-950/20 border border-emerald-500/25 p-3 rounded-xl">
                  <p className="text-[11px] text-emerald-400">Mock OTP generated by server: <strong className="text-sm font-extrabold">{mockOtp}</strong></p>
                </div>
                <div>
                  <label className="text-xs text-textGray uppercase font-bold block mb-1">Enter OTP Code</label>
                  <input
                    type="text"
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter mock code"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-textGray uppercase font-bold block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 chars"
                    className="input-field text-sm"
                  />
                </div>
                <button type="submit" className="w-full btn-primary text-sm py-2">
                  Save New Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
