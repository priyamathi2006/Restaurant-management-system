import React, { useState } from "react";
import { Users, Calendar, Clock, MessageSquare, ClipboardCheck } from "lucide-react";

export default function ReservationForm({ onSubmitReservation, loading, error }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [tableNumber, setTableNumber] = useState(null);
  const [specialRequests, setSpecialRequests] = useState("");

  const tables = [
    { number: 1, capacity: 2, desc: "Window Side" },
    { number: 2, capacity: 2, desc: "Window Side" },
    { number: 3, capacity: 4, desc: "Main Hall" },
    { number: 4, capacity: 4, desc: "Main Hall" },
    { number: 5, capacity: 4, desc: "Cozy Corner" },
    { number: 6, capacity: 6, desc: "Family Table" },
    { number: 7, capacity: 6, desc: "Family Table" },
    { number: 8, capacity: 8, desc: "Grand Suite" },
    { number: 9, capacity: 4, desc: "Private Booth" },
    { number: 10, capacity: 2, desc: "Bar Side" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tableNumber) {
      alert("Please select a table from the floor map grid.");
      return;
    }
    
    // Combine Date and Time
    const reservationDate = new Date(`${date}T${time}`);
    
    onSubmitReservation({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      reservationDate,
      guests,
      tableNumber,
      specialRequests,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Contact info */}
        <div>
          <label className="text-xs text-textGray font-semibold uppercase block mb-1">Your Name</label>
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
          <label className="text-xs text-textGray font-semibold uppercase block mb-1">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-textGray font-semibold uppercase block mb-1">Phone Number</label>
          <input 
            type="tel" 
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="input-field text-sm"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-textGray font-semibold uppercase block mb-1">Date</label>
            <div className="relative">
              <input 
                type="date" 
                required
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field text-sm pr-10"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-textGray font-semibold uppercase block mb-1">Time Slot</label>
            <input 
              type="time" 
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
        {/* Guests count */}
        <div>
          <label className="text-xs text-textGray font-semibold uppercase block mb-2">Number of Guests</label>
          <div className="flex items-center gap-2">
            {[1, 2, 4, 6, 8].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGuests(g)}
                className={`py-2 px-4 rounded-xl text-sm font-semibold border transition-all ${
                  guests === g 
                    ? "bg-accentAmber/10 border-accentAmber text-accentAmber" 
                    : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                {g} {g === 1 ? "Guest" : "Guests"}
              </button>
            ))}
          </div>
        </div>

        {/* Special request */}
        <div>
          <label className="text-xs text-textGray font-semibold uppercase block mb-1">Special Requests (Optional)</label>
          <input 
            type="text"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="e.g. Allergen notes, anniversary, high chair"
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Visual Table Selection */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs text-textGray font-semibold uppercase block">Select Table (Floor Layout)</label>
          <div className="flex gap-4 text-[10px] text-textGray">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-800 rounded border border-slate-700"></span> Available</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-accentAmber/10 rounded border border-accentAmber"></span> Selected</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {tables.map((t) => {
            const isSelected = tableNumber === t.number;
            return (
              <button
                key={t.number}
                type="button"
                onClick={() => setTableNumber(t.number)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                  isSelected 
                    ? "bg-accentAmber/15 border-accentAmber shadow-glow/10" 
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-bold ${isSelected ? "text-accentAmber" : "text-textLight"}`}>Table #{t.number}</span>
                  <span className="text-[10px] bg-slate-850 px-1.5 py-0.5 rounded text-textGray font-semibold">{t.capacity} Pax</span>
                </div>
                <span className="text-[10px] text-textGray font-medium">{t.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-semibold"
      >
        <ClipboardCheck className="h-5 w-5" />
        {loading ? "Booking Table..." : "Book Selected Table"}
      </button>
    </form>
  );
}
