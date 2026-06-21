import React, { useState, useEffect } from "react";
import { Bike, MapPin, Home, CheckCircle2 } from "lucide-react";

export default function LiveMap({ orderStatus }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (orderStatus === "OutForDelivery") {
      setProgress(10);
      // Simulate active movement
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            return 95; // Wait at 95% until marked delivered
          }
          return prev + 2;
        });
      }, 800);
    } else if (orderStatus === "Delivered") {
      setProgress(100);
    } else {
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderStatus]);

  // SVG dimensions
  const width = 500;
  const height = 150;

  // SVG curved path coordinates (cubic bezier)
  // M x1 y1 C cp1x cp1y, cp2x cp2y, x2 y2
  const pathString = "M 50,75 C 150,15 200,135 250,75 C 300,15 350,135 450,75";

  // Quick function to get coordinates along bezier path at ratio t (0 to 1)
  // This is a rough estimation to place the icon on the line dynamically!
  const getCoordinatesAlongPath = (t) => {
    // We can estimate the coordinates linearly for the layout
    const x = 50 + t * 400;
    // Estimate y as a wave corresponding to the bezier curves
    const y = 75 + Math.sin(t * Math.PI * 4) * 45;
    return { x, y };
  };

  const scooterPos = getCoordinatesAlongPath(progress / 100);

  return (
    <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80 relative overflow-hidden flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs text-textGray font-semibold uppercase tracking-wider">Live Delivery Route Simulator</span>
        <span className="text-xs font-bold text-accentGreen flex items-center gap-1">
          {orderStatus === "OutForDelivery" && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
          {orderStatus === "Delivered" ? "Delivered successfully" : orderStatus === "OutForDelivery" ? "Driver is on the way" : "Driver awaiting pickup"}
        </span>
      </div>

      {/* SVG Map Canvas */}
      <div className="w-full flex justify-center bg-slate-900/60 rounded-xl py-4 border border-slate-850">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full max-w-lg aspect-[10/3]"
        >
          {/* Grid lines (decorative) */}
          <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5,5" />
          <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5,5" />

          {/* Road Path Background */}
          <path 
            d={pathString} 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="8" 
            strokeLinecap="round"
          />

          {/* Active Path Tracker */}
          <path 
            d={pathString} 
            fill="none" 
            stroke="url(#roadGradient)" 
            strokeWidth="6" 
            strokeLinecap="round"
            className="map-path"
          />

          {/* Gradients definitions */}
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          {/* Restaurant Pin */}
          <g transform="translate(50, 75)">
            <circle cx="0" cy="0" r="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            <foreignObject x="-7" y="-7" width="14" height="14">
              <MapPin className="h-3.5 w-3.5 text-accentAmber" />
            </foreignObject>
            <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">Kitchen</text>
          </g>

          {/* Customer House Pin */}
          <g transform="translate(450, 75)">
            <circle cx="0" cy="0" r="14" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
            <foreignObject x="-7" y="-7" width="14" height="14">
              <Home className="h-3.5 w-3.5 text-accentGreen" />
            </foreignObject>
            <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">Home</text>
          </g>

          {/* Scooter Driver */}
          {progress > 0 && progress < 100 && (
            <g transform={`translate(${scooterPos.x}, ${scooterPos.y})`}>
              <circle cx="0" cy="0" r="16" fill="#f59e0b" className="animate-pulse shadow-glow" />
              <foreignObject x="-8" y="-8" width="16" height="16">
                <Bike className="h-4 w-4 text-white" />
              </foreignObject>
            </g>
          )}

          {/* Delivered Checkmark */}
          {progress === 100 && (
            <g transform="translate(450, 75) scale(1.2)">
              <circle cx="0" cy="0" r="14" fill="#10b981" />
              <foreignObject x="-7" y="-7" width="14" height="14">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </foreignObject>
            </g>
          )}
        </svg>
      </div>

      <div className="w-full max-w-md mt-4 flex items-center justify-between text-xs text-textGray">
        <span>Distance: ~2.4 km</span>
        <span>Estimated Time: {orderStatus === "Delivered" ? "0 Mins" : orderStatus === "OutForDelivery" ? `${Math.max(1, Math.round((100 - progress) * 0.15))} Mins` : "12 Mins"}</span>
      </div>
    </div>
  );
}
