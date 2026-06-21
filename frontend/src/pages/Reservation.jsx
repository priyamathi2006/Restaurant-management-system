import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Calendar, UserPlus, Sparkles, Clock, CheckCircle } from "lucide-react";
import ReservationForm from "../components/ReservationForm";
import { api } from "../services/api";

export default function Reservation() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successReservation, setSuccessReservation] = useState(null);
  const [myReservations, setMyReservations] = useState([]);

  const fetchMyReservations = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get("/reservations/myreservations");
      if (res.success) {
        setMyReservations(res.reservations);
      }
    } catch (err) {
      console.error("Could not load user reservations");
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, [isAuthenticated]);

  const handleSubmitReservation = async (formData) => {
    try {
      setLoading(true);
      setError("");
      setSuccessReservation(null);

      const res = await api.post("/reservations", formData);

      if (res.success) {
        setSuccessReservation(res.reservation);
        // Refresh list
        fetchMyReservations();
      } else {
        setError(res.message || "Failed to make reservation.");
      }
    } catch (err) {
      setError("Network error submitting table booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 text-left">
      {/* Top Banner */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <span className="p-2 bg-slate-900 border border-slate-800 text-accentAmber text-xs font-semibold rounded-xl flex items-center gap-1.5 w-fit mx-auto">
          <Sparkles className="h-4 w-4" /> Visual Table Selection
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">Book A Dining Table</h1>
        <p className="text-textGray text-sm">Select dates, guests and choose your exact table visually. Bookings are processed instantly.</p>
      </div>

      {/* Main Content */}
      {successReservation ? (
        <div className="glass-panel p-8 text-center space-y-5 max-w-md mx-auto border border-emerald-500/20 shadow-glowGreen/10">
          <div className="mx-auto bg-emerald-500/10 p-4 rounded-full w-fit text-accentGreen">
            <CheckCircle className="h-10 w-10" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-textLight">Reservation Placed!</h3>
            <p className="text-textGray text-xs mt-1">Your request is pending review by our hostess team.</p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-left text-sm space-y-2 text-slate-300">
            <p>• <strong>Table Assigned:</strong> Table #{successReservation.tableNumber}</p>
            <p>• <strong>Guests:</strong> {successReservation.guests} Seater</p>
            <p>• <strong>Date:</strong> {new Date(successReservation.reservationDate).toLocaleDateString()}</p>
            <p>• <strong>Time Slot:</strong> {new Date(successReservation.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <button 
            onClick={() => setSuccessReservation(null)}
            className="btn-secondary w-full py-2.5 text-sm"
          >
            Book Another Table
          </button>
        </div>
      ) : !isAuthenticated ? (
        <div className="glass-panel p-12 text-center space-y-4 max-w-md mx-auto">
          <Calendar className="h-12 w-12 text-slate-650 mx-auto" />
          <h3 className="font-heading font-bold text-lg">Sign In Required</h3>
          <p className="text-textGray text-sm">Please log in to register table selections and check live availability slots.</p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-1.5 py-2 px-6">
            <UserPlus className="h-4 w-4" /> Login to Account
          </Link>
        </div>
      ) : (
        <div className="glass-panel p-6 sm:p-8 border border-slate-800/80">
          <ReservationForm 
            onSubmitReservation={handleSubmitReservation} 
            loading={loading}
            error={error}
          />
        </div>
      )}

      {/* Reservation History */}
      {isAuthenticated && myReservations.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-850">
          <h2 className="text-xl font-bold font-heading">My Booking History</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myReservations.map((res) => (
              <div 
                key={res._id}
                className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-textLight">Table #{res.tableNumber} ({res.guests} Guests)</p>
                  <p className="text-xs text-textGray flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(res.reservationDate).toLocaleDateString()} at{" "}
                    {new Date(res.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  res.status === "Confirmed"
                    ? "bg-emerald-950/30 border-emerald-500/25 text-emerald-400"
                    : res.status === "Cancelled"
                    ? "bg-red-950/30 border-red-500/25 text-red-400"
                    : "bg-amber-950/30 border-amber-500/25 text-accentAmber"
                }`}>
                  {res.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
