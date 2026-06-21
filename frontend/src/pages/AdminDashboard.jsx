import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TrendingUp, ShoppingBag, Calendar, Users, Eye, Edit2, Trash2, Plus, X, ShieldCheck } from "lucide-react";
import { setOrders, updateActiveOrderState } from "../redux/slices/orderSlice";
import { fetchMenuStart, fetchMenuSuccess, fetchMenuFailed, addFoodItem, updateFoodItem, deleteFoodItem } from "../redux/slices/menuSlice";
import { setUsers } from "../redux/slices/authSlice";
import { connectSocket } from "../services/socket";
import { api } from "../services/api";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { foods } = useSelector((state) => state.menu);
  const { users } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("analytics"); // analytics, menu, orders, reservations, users
  const [loading, setLoading] = useState(true);

  // Menu Management Modal states
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null); // null for create, object for edit
  const [foodName, setFoodName] = useState("");
  const [foodCategory, setFoodCategory] = useState("Starters");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodImage, setFoodImage] = useState("");
  const [foodDesc, setFoodDesc] = useState("");
  const [foodVeg, setFoodVeg] = useState(true);
  const [foodAvailable, setFoodAvailable] = useState(true);
  const [foodPrep, setFoodPrep] = useState(15);

  // Reservations state
  const [reservations, setReservations] = useState([]);

  // Fetch all resources
  const fetchAllData = async () => {
    try {
      setLoading(true);
      // Fetch Orders
      const orderRes = await api.get("/orders");
      if (orderRes.success) dispatch(setOrders(orderRes.orders));

      // Fetch Foods
      const foodRes = await api.get("/foods");
      if (foodRes.success) dispatch(fetchMenuSuccess(foodRes.foods));

      // Fetch Users
      const usersRes = await api.get("/auth/users");
      if (usersRes.success) dispatch(setUsers(usersRes.users));

      // Fetch Reservations
      const resRes = await api.get("/reservations");
      if (resRes.success) setReservations(resRes.reservations);

    } catch (err) {
      console.error("Error fetching admin statistics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Socket triggers
  useEffect(() => {
    if (!user) return;
    const socket = connectSocket(user._id, user.role);

    if (socket) {
      socket.on("orderStatusChange", (updatedOrder) => {
        dispatch(updateActiveOrderState(updatedOrder));
      });
      socket.on("newOrder", (newOrder) => {
        dispatch(updateActiveOrderState(newOrder));
      });
    }

    return () => {
      if (socket) {
        socket.off("orderStatusChange");
        socket.off("newOrder");
      }
    };
  }, [user]);

  // Operations
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.success) {
        dispatch(updateActiveOrderState(res.order));
        alert("Status updated successfully!");
      }
    } catch (e) {
      alert("Error saving order status.");
    }
  };

  const handleUpdateReservationStatus = async (resId, newStatus) => {
    try {
      const res = await api.put(`/reservations/${resId}/status`, { status: newStatus });
      if (res.success) {
        setReservations(prev => prev.map(r => r._id === resId ? { ...r, status: newStatus } : r));
        alert("Reservation status updated!");
      }
    } catch (e) {
      alert("Error updating reservation status.");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await api.put(`/auth/users/${userId}/role`, { role: newRole });
      if (res.success) {
        dispatch(setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u)));
        alert(`Role changed to ${newRole}!`);
      }
    } catch (e) {
      alert("Error changing user role.");
    }
  };

  const openFoodModal = (food = null) => {
    if (food) {
      setEditingFood(food);
      setFoodName(food.name);
      setFoodCategory(food.category);
      setFoodPrice(food.price);
      setFoodImage(food.image);
      setFoodDesc(food.description);
      setFoodVeg(food.isVeg);
      setFoodAvailable(food.isAvailable);
      setFoodPrep(food.prepTime);
    } else {
      setEditingFood(null);
      setFoodName("");
      setFoodCategory("Starters");
      setFoodPrice("");
      setFoodImage("");
      setFoodDesc("");
      setFoodVeg(true);
      setFoodAvailable(true);
      setFoodPrep(15);
    }
    setMenuModalOpen(true);
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    const payload = {
      name: foodName,
      category: foodCategory,
      price: Number(foodPrice),
      image: foodImage,
      description: foodDesc,
      isVeg: foodVeg,
      isAvailable: foodAvailable,
      prepTime: Number(foodPrep),
    };

    try {
      if (editingFood) {
        const res = await api.put(`/foods/${editingFood._id}`, payload);
        if (res.success) {
          dispatch(updateFoodItem(res.food));
          alert("Food item updated!");
        }
      } else {
        const res = await api.post("/foods", payload);
        if (res.success) {
          dispatch(addFoodItem(res.food));
          alert("Food item added successfully!");
        }
      }
      setMenuModalOpen(false);
    } catch (err) {
      alert("Error saving menu option details.");
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to remove this dish?")) return;
    try {
      const res = await api.delete(`/foods/${foodId}`);
      if (res.success) {
        dispatch(deleteFoodItem(foodId));
        alert("Dish deleted!");
      }
    } catch (err) {
      alert("Error deleting food option.");
    }
  };

  // Math metrics calculations
  const totalSales = orders
    .filter((o) => o.paymentStatus === "Paid" || o.orderStatus === "Delivered")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeReservationsCount = reservations.filter((r) => r.status !== "Cancelled").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 text-left">
      {/* Top dashboard header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold font-heading flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-accentAmber" />
          Restaurant Administration Control
        </h1>
        <p className="text-textGray text-sm">Monitor sales trends, manage reservations, update menu sheets, and assign staff permissions.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-accentGreen"><TrendingUp className="h-6 w-6" /></div>
          <div>
            <p className="text-xs text-textGray font-semibold uppercase">Total Sales</p>
            <p className="text-lg font-bold text-textLight font-heading">₹{totalSales}</p>
          </div>
        </div>
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-accentAmber"><ShoppingBag className="h-6 w-6" /></div>
          <div>
            <p className="text-xs text-textGray font-semibold uppercase">Total Orders</p>
            <p className="text-lg font-bold text-textLight font-heading">{orders.length}</p>
          </div>
        </div>
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Calendar className="h-6 w-6" /></div>
          <div>
            <p className="text-xs text-textGray font-semibold uppercase">Reservations</p>
            <p className="text-lg font-bold text-textLight font-heading">{activeReservationsCount}</p>
          </div>
        </div>
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Users className="h-6 w-6" /></div>
          <div>
            <p className="text-xs text-textGray font-semibold uppercase">Registered Users</p>
            <p className="text-lg font-bold text-textLight font-heading">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Selector tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { key: "analytics", label: "Analytics Dashboard" },
          { key: "menu", label: "Menu Catalogue (CRUD)" },
          { key: "orders", label: "Orders Control" },
          { key: "reservations", label: "Table Bookings" },
          { key: "users", label: "Users & Staff Roles" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-3 px-6 font-heading font-medium text-sm whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === tab.key
                ? "border-accentAmber text-accentAmber font-bold"
                : "border-transparent text-textGray hover:text-textLight"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading overlay */}
      {loading ? (
        <div className="h-60 flex items-center justify-center text-textGray">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accentAmber mr-3"></div>
          Syncing administrative ledger...
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Subpanel 1: Analytics */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-panel p-6 border border-slate-800">
                <h3 className="font-heading font-bold text-base text-slate-200 mb-4">Simulated Weekly Revenue Curve</h3>
                
                {/* SVG Visual Sales Curve */}
                <div className="w-full flex justify-center bg-slate-950/40 rounded-xl py-3 border border-slate-850">
                  <svg viewBox="0 0 400 160" className="w-full max-w-md">
                    {/* SVG axes */}
                    <line x1="40" y1="20" x2="40" y2="130" stroke="#334155" strokeWidth="1" />
                    <line x1="40" y1="130" x2="380" y2="130" stroke="#334155" strokeWidth="1" />

                    {/* Chart path */}
                    <path 
                      d="M 50,110 L 100,105 L 150,85 L 200,92 L 250,65 L 300,50 L 350,30" 
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="2.5" 
                    />
                    
                    {/* Grid nodes */}
                    <circle cx="50" cy="110" r="4" fill="#ea580c" />
                    <circle cx="100" cy="105" r="4" fill="#ea580c" />
                    <circle cx="150" cy="85" r="4" fill="#ea580c" />
                    <circle cx="200" cy="92" r="4" fill="#ea580c" />
                    <circle cx="250" cy="65" r="4" fill="#ea580c" />
                    <circle cx="300" cy="50" r="4" fill="#ea580c" />
                    <circle cx="350" cy="30" r="4" fill="#ea580c" />

                    {/* Labels */}
                    <text x="50" y="145" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">Mon</text>
                    <text x="100" y="145" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">Tue</text>
                    <text x="150" y="145" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">Wed</text>
                    <text x="200" y="145" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">Thu</text>
                    <text x="250" y="145" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">Fri</text>
                    <text x="300" y="145" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">Sat</text>
                    <text x="350" y="145" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">Sun</text>

                    <text x="35" y="113" textAnchor="end" fill="#64748b" fontSize="8" fontWeight="bold">₹2k</text>
                    <text x="35" y="88" textAnchor="end" fill="#64748b" fontSize="8" fontWeight="bold">₹5k</text>
                    <text x="35" y="53" textAnchor="end" fill="#64748b" fontSize="8" fontWeight="bold">₹8k</text>
                    <text x="35" y="33" textAnchor="end" fill="#64748b" fontSize="8" fontWeight="bold">₹12k</text>
                  </svg>
                </div>
              </div>

              <div className="glass-panel p-6 border border-slate-800 space-y-4">
                <h3 className="font-heading font-bold text-base text-slate-200">Catalog Category Distribution</h3>
                <div className="space-y-3.5 pt-2">
                  {["Starters", "Main Course", "Desserts", "Beverages"].map((cat) => {
                    const count = foods.filter((f) => f.category === cat).length;
                    const percent = foods.length > 0 ? (count / foods.length) * 100 : 0;

                    return (
                      <div key={cat} className="space-y-1 text-xs">
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-350">{cat}</span>
                          <span className="text-textLight">{count} items ({Math.round(percent)}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-accentAmber h-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Subpanel 2: Menu CRUD */}
          {activeTab === "menu" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-bold text-lg text-slate-250">Items List ({foods.length})</h3>
                <button
                  onClick={() => openFoodModal()}
                  className="btn-primary py-2 text-xs flex items-center gap-1.5 font-bold"
                >
                  <Plus className="h-4 w-4" /> Add Food Item
                </button>
              </div>

              <div className="glass-panel overflow-hidden border border-slate-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-850 text-textGray font-semibold uppercase tracking-wider">
                        <th className="p-4">Dish Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Diet</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {foods.map((food) => (
                        <tr key={food._id} className="hover:bg-slate-900/40 text-slate-300">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={food.image} alt={food.name} className="w-10 h-10 rounded-lg object-cover bg-slate-950" />
                              <div>
                                <p className="font-bold text-textLight">{food.name}</p>
                                <p className="text-[10px] text-textGray">Prep: {food.prepTime} mins | Rate: ★{food.rating?.toFixed(1)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{food.category}</td>
                          <td className="p-4 font-bold text-textLight">₹{food.price}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              food.isVeg ? "bg-emerald-950/30 border border-emerald-500/20 text-emerald-400" : "bg-red-950/30 border border-red-500/20 text-red-400"
                            }`}>
                              {food.isVeg ? "Veg" : "Non-Veg"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              food.isAvailable ? "bg-emerald-950/30 border border-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                            }`}>
                              {food.isAvailable ? "In Stock" : "Out"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => openFoodModal(food)}
                                className="p-1.5 text-textGray hover:text-accentAmber hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFood(food._id)}
                                className="p-1.5 text-textGray hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Subpanel 3: Orders Control */}
          {activeTab === "orders" && (
            <div className="glass-panel overflow-hidden border border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-850 text-textGray font-semibold uppercase">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer Contact</th>
                      <th className="p-4">Placed Date</th>
                      <th className="p-4">Billing</th>
                      <th className="p-4">Workflow Status</th>
                      <th className="p-4">Action Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-900/40 text-slate-350">
                        <td className="p-4 font-bold text-textLight">#{o._id.substring(o._id.length - 8)}</td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-200">{o.userId?.name || "Deleted User"}</p>
                          <p className="text-[10px] text-textGray">{o.phone}</p>
                        </td>
                        <td className="p-4">
                          {new Date(o.createdAt).toLocaleDateString()} at{" "}
                          {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-textLight">₹{o.totalAmount}</p>
                          <p className="text-[10px] text-textGray uppercase tracking-wider">{o.paymentMethod} ({o.paymentStatus})</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase ${
                            o.orderStatus === "Delivered"
                              ? "bg-emerald-950/30 border-emerald-500/25 text-emerald-400"
                              : o.orderStatus === "OutForDelivery"
                              ? "bg-purple-950/30 border-purple-500/25 text-purple-400"
                              : o.orderStatus === "Ready"
                              ? "bg-teal-950/30 border-teal-500/25 text-teal-400"
                              : o.orderStatus === "Preparing"
                              ? "bg-blue-950/30 border-blue-500/25 text-blue-400"
                              : o.orderStatus === "Accepted"
                              ? "bg-amber-950/30 border-amber-500/25 text-accentAmber"
                              : "bg-slate-800 border-slate-700 text-slate-400"
                          }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                            className="bg-slate-900 border border-slate-750 text-xs text-textLight rounded p-1.5 focus:outline-none focus:border-accentAmber"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="OutForDelivery">Out For Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subpanel 4: Table Bookings */}
          {activeTab === "reservations" && (
            <div className="glass-panel overflow-hidden border border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-850 text-textGray font-semibold uppercase">
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Reservation Date</th>
                      <th className="p-4">Table & Guests</th>
                      <th className="p-4">Requests</th>
                      <th className="p-4">Approval Status</th>
                      <th className="p-4 text-center">Confirm / Decline Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {reservations.map((res) => (
                      <tr key={res._id} className="hover:bg-slate-900/40 text-slate-350">
                        <td className="p-4">
                          <p className="font-bold text-textLight">{res.customerName}</p>
                          <p className="text-[10px] text-textGray">{res.customerPhone} | {res.customerEmail}</p>
                        </td>
                        <td className="p-4">
                          {new Date(res.reservationDate).toLocaleDateString()} at{" "}
                          {new Date(res.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-textLight">Table #{res.tableNumber}</p>
                          <p className="text-[10px] text-textGray">Covers: {res.guests} Pax</p>
                        </td>
                        <td className="p-4 max-w-[150px] truncate" title={res.specialRequests}>
                          {res.specialRequests || "-"}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            res.status === "Confirmed"
                              ? "bg-emerald-950/30 border-emerald-500/25 text-emerald-400"
                              : res.status === "Cancelled"
                              ? "bg-red-950/30 border-red-500/25 text-red-400"
                              : "bg-amber-950/30 border-amber-500/25 text-accentAmber"
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            {res.status !== "Confirmed" && (
                              <button
                                onClick={() => handleUpdateReservationStatus(res._id, "Confirmed")}
                                className="px-3 py-1 bg-emerald-950/20 border border-emerald-500/35 hover:bg-emerald-900/30 text-emerald-400 text-[10px] font-bold rounded transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            {res.status !== "Cancelled" && (
                              <button
                                onClick={() => handleUpdateReservationStatus(res._id, "Cancelled")}
                                className="px-3 py-1 bg-red-950/20 border border-red-500/35 hover:bg-red-900/30 text-red-400 text-[10px] font-bold rounded transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subpanel 5: User & Staff Roles */}
          {activeTab === "users" && (
            <div className="glass-panel overflow-hidden border border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-850 text-textGray font-semibold uppercase">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4">Current Role</th>
                      <th className="p-4">Update Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-900/40 text-slate-350">
                        <td className="p-4 font-bold text-textLight">{u.name}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">{u.phone}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            u.role === "Admin"
                              ? "bg-red-950/30 border-red-500/25 text-red-400"
                              : u.role === "Chef"
                              ? "bg-blue-950/30 border-blue-500/25 text-blue-400"
                              : u.role === "Delivery"
                              ? "bg-purple-950/30 border-purple-500/25 text-purple-400"
                              : "bg-slate-800 border-slate-700 text-slate-400"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {u._id === user._id ? (
                            <span className="text-[10px] text-textGray italic">Cannot self-downgrade</span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u._id, e.target.value)}
                              className="bg-slate-900 border border-slate-750 text-xs text-textLight rounded p-1.5 focus:outline-none focus:border-accentAmber"
                            >
                              <option value="Customer">Customer</option>
                              <option value="Chef">Chef</option>
                              <option value="Delivery">Delivery</option>
                              <option value="Admin">Admin</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Menu Management Modal (Add/Edit) */}
      {menuModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl relative shadow-2xl my-8 text-left space-y-4">
            <button 
              onClick={() => setMenuModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-textGray hover:text-white hover:bg-slate-800 rounded-full"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <h3 className="font-heading font-bold text-lg text-textLight">
              {editingFood ? "Edit Catalog Item" : "Create Catalog Item"}
            </h3>

            <form onSubmit={handleSaveFood} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-textGray font-bold uppercase block mb-1">Dish Name</label>
                <input 
                  type="text" 
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Garlic Bread"
                  className="input-field py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-textGray font-bold uppercase block mb-1">Category</label>
                  <select
                    value={foodCategory}
                    onChange={(e) => setFoodCategory(e.target.value)}
                    className="input-field py-2 text-xs bg-slate-900"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-textGray font-bold uppercase block mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={foodPrice}
                    onChange={(e) => setFoodPrice(e.target.value)}
                    placeholder="e.g. 250"
                    className="input-field py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-textGray font-bold uppercase block mb-1">Food Image URL</label>
                <input 
                  type="text"
                  value={foodImage}
                  onChange={(e) => setFoodImage(e.target.value)}
                  placeholder="Paste high-quality unsplash/cloudinary image URL"
                  className="input-field py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-textGray font-bold uppercase block mb-1">Description</label>
                <textarea 
                  value={foodDesc}
                  onChange={(e) => setFoodDesc(e.target.value)}
                  placeholder="Describe the dish ingredients..."
                  rows={2}
                  className="input-field py-2 text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-textGray font-bold uppercase block mb-1.5">Diet Type</label>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                      <input 
                        type="radio" 
                        name="dietType"
                        checked={foodVeg}
                        onChange={() => setFoodVeg(true)}
                        className="accent-accentAmber"
                      />
                      Veg
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                      <input 
                        type="radio" 
                        name="dietType"
                        checked={!foodVeg}
                        onChange={() => setFoodVeg(false)}
                        className="accent-accentAmber"
                      />
                      Non-Veg
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-textGray font-bold uppercase block mb-1.5">Prep Time (mins)</label>
                  <input 
                    type="number" 
                    value={foodPrep}
                    onChange={(e) => setFoodPrep(e.target.value)}
                    className="input-field py-1 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-textGray font-bold uppercase block mb-1.5">In Stock</label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 mt-1">
                    <input 
                      type="checkbox"
                      checked={foodAvailable}
                      onChange={(e) => setFoodAvailable(e.target.checked)}
                      className="rounded accent-accentAmber w-4 h-4"
                    />
                    Available
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full btn-primary py-2.5 font-bold text-xs mt-3 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="h-4.5 w-4.5" />
                {editingFood ? "Save Catalog Item" : "Create Catalog Item"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
