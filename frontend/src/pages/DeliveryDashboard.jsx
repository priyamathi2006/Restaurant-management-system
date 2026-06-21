import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Truck, MapPin, CheckCircle, Navigation, Phone } from "lucide-react";
import LiveMap from "../components/LiveMap";
import { setOrders, updateActiveOrderState } from "../redux/slices/orderSlice";
import { connectSocket } from "../services/socket";
import { api } from "../services/api";

export default function DeliveryDashboard() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      if (res.success) {
        dispatch(setOrders(res.orders));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Sync WebSocket updates
  useEffect(() => {
    if (!user) return;
    const socket = connectSocket(user._id, user.role);

    if (socket) {
      socket.on("orderStatusChange", (updatedOrder) => {
        dispatch(updateActiveOrderState(updatedOrder));
      });
      // Also fetch list again when a chef adds a new "Ready" order
      socket.on("newOrder", () => {
        fetchOrders();
      });
    }

    return () => {
      if (socket) {
        socket.off("orderStatusChange");
        socket.off("newOrder");
      }
    };
  }, [user]);

  const claimOrder = async (orderId) => {
    try {
      const res = await api.put(`/orders/${orderId}/assign`, {});
      if (res.success) {
        dispatch(updateActiveOrderState(res.order));
        fetchOrders(); // Refresh list to sync assigned statuses
        alert("Assigned to you successfully! Get ready to deliver.");
      } else {
        alert(res.message || "Failed to claim order.");
      }
    } catch (err) {
      alert("Error contacting the logistics server.");
    }
  };

  const deliverOrder = async (orderId) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        orderStatus: "Delivered",
        paymentStatus: "Paid", // Ensure payment status is Paid upon Delivery
      });
      if (res.success) {
        dispatch(updateActiveOrderState(res.order));
        fetchOrders();
        alert("Order delivered successfully!");
      } else {
        alert(res.message || "Failed to mark order as delivered.");
      }
    } catch (err) {
      alert("Error saving delivery completion.");
    }
  };

  // Split orders into available jobs vs assigned rider jobs
  const availableJobs = orders.filter((o) => o.orderStatus === "Ready" && !o.deliveryPartner);
  const myActiveJobs = orders.filter((o) => o.orderStatus === "OutForDelivery" && o.deliveryPartner?._id === user?._id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 text-left">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold font-heading flex items-center gap-2">
          <Truck className="h-8 w-8 text-accentAmber" />
          Delivery Logistics Dashboard
        </h1>
        <p className="text-textGray text-sm">Accept available shipments and manage your active navigation routes.</p>
      </div>

      {/* Grid containing Available Jobs vs Active Routes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left pane: Active driver jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold font-heading text-textLight flex items-center gap-2">
              <Navigation className="h-5 w-5 text-accentOrange animate-pulse" />
              Active Shipping Jobs ({myActiveJobs.length})
            </h2>

            {myActiveJobs.length === 0 ? (
              <div className="p-8 text-center text-textGray text-sm italic">
                You have no active deliveries. Claim a job from the panel to start.
              </div>
            ) : (
              <div className="space-y-6">
                {myActiveJobs.map((job) => (
                  <div 
                    key={job._id}
                    className="bg-slate-950/40 p-5 rounded-2xl border border-slate-850 space-y-4 text-xs text-textGray"
                  >
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="font-bold text-sm text-textLight">Order Reference: #{job._id.substring(job._id.length - 8)}</span>
                      <span className="text-accentAmber font-bold uppercase">In Transit</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-400">Recipient Details</p>
                        <p className="text-textLight font-medium">{job.userId?.name}</p>
                        <p className="text-textGray flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-accentAmber" /> {job.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-400">Destination Address</p>
                        <p className="text-textLight leading-relaxed flex items-start gap-1">
                          <MapPin className="h-4 w-4 shrink-0 text-accentOrange mt-0.5" />
                          <span>{job.address}</span>
                        </p>
                      </div>
                    </div>

                    <LiveMap orderStatus={job.orderStatus} />

                    <div className="flex gap-3 pt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => deliverOrder(job._id)}
                        className="flex-1 btn-success text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="h-4 w-4" /> Mark as Delivered
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Available jobs queue */}
        <div className="glass-panel p-6 border border-slate-800 space-y-4 h-fit">
          <h2 className="text-lg font-bold font-heading text-textLight flex items-center gap-2">
            <Truck className="h-5 w-5 text-accentAmber" />
            Pickup Queue ({availableJobs.length})
          </h2>

          {loading ? (
            <div className="py-8 text-center text-textGray text-sm">
              Loading pickups...
            </div>
          ) : availableJobs.length === 0 ? (
            <div className="py-8 text-center text-textGray text-sm italic">
              Awaiting ready orders from the kitchen.
            </div>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {availableJobs.map((item) => (
                <div 
                  key={item._id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-200">Order #{item._id.substring(item._id.length - 8)}</p>
                    <p className="text-[10px] text-textGray">Amount: ₹{item.totalAmount} | Prep complete</p>
                    <p className="text-slate-400 line-clamp-2 mt-1 flex items-start gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-accentOrange mt-0.5" />
                      <span>{item.address}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => claimOrder(item._id)}
                    className="w-full btn-primary py-2 text-xs font-bold text-center cursor-pointer"
                  >
                    Accept Shipment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
