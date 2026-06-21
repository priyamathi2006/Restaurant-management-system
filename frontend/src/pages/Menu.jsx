import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, SlidersHorizontal, Eye, X, Star, MessageSquare, ShoppingBag } from "lucide-react";
import FoodCard from "../components/FoodCard";
import { fetchMenuStart, fetchMenuSuccess, fetchMenuFailed } from "../redux/slices/menuSlice";
import { api } from "../services/api";

export default function Menu() {
  const dispatch = useDispatch();
  const { foods, loading, error } = useSelector((state) => state.menu);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isVeg, setIsVeg] = useState(""); // "" = Both, "true" = Veg, "false" = Non-Veg
  const [maxPrice, setMaxPrice] = useState(1000);
  const [rating, setRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Details Modal State
  const [selectedFood, setSelectedFood] = useState(null);
  
  // Submit Review State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const categories = ["All", "Starters", "Main Course", "Desserts", "Beverages"];

  // Fetch Menu from API
  const fetchMenu = async () => {
    try {
      dispatch(fetchMenuStart());
      
      // Build query string
      let queryString = "?";
      if (search) queryString += `search=${search}&`;
      if (category !== "All") queryString += `category=${category}&`;
      if (isVeg !== "") queryString += `isVeg=${isVeg}&`;
      if (maxPrice < 1000) queryString += `maxPrice=${maxPrice}&`;
      if (rating) queryString += `rating=${rating}&`;

      const result = await api.get(`/foods${queryString}`);
      if (result.success) {
        dispatch(fetchMenuSuccess(result.foods));
      } else {
        dispatch(fetchMenuFailed(result.message));
      }
    } catch (err) {
      dispatch(fetchMenuFailed("Could not connect to API"));
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [search, category, isVeg, maxPrice, rating]);

  const handleOpenDetails = (food) => {
    setSelectedFood(food);
    // Reset review form
    setReviewRating(5);
    setReviewComment("");
  };

  const handleCloseDetails = () => {
    setSelectedFood(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    try {
      setReviewSubmitting(true);
      const res = await api.post(`/foods/${selectedFood._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });

      if (res.success) {
        // Update local modal food details
        setSelectedFood(res.food);
        // Re-fetch main menu to update ratings counts
        fetchMenu();
        setReviewComment("");
        setReviewRating(5);
        alert("Review added successfully!");
      } else {
        alert(res.message || "Failed to add review.");
      }
    } catch (err) {
      alert("Error submitting review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      {/* Top Banner with Premium Gradient & Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 p-8 sm:p-12 text-center space-y-4 shadow-glow/5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accentAmber/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accentOrange/5 rounded-full blur-3xl pointer-events-none" />
        
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 text-accentAmber text-xs font-semibold uppercase tracking-wider rounded-full border border-slate-800">
          ✨ Finest Culinary Art
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight text-textLight">
          Explore Our <span className="bg-gradient-to-r from-accentAmber to-accentOrange bg-clip-text text-transparent">Gourmet Menu</span>
        </h1>
        <p className="text-textGray text-sm max-w-xl mx-auto leading-relaxed font-sans">
          Savor our curated selection of fine culinary creations, crafted from premium fresh ingredients by our master chefs.
        </p>
      </div>

      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search for dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11 text-sm py-3 focus:ring-accentAmber/30 focus:border-accentAmber/60 bg-slate-900/40 backdrop-blur-sm border-slate-800"
          />
          <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
        </div>

        {/* Filter toggler */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary py-3 text-sm flex items-center gap-2 ${
            showFilters ? "border-accentAmber text-accentAmber bg-accentAmber/5 shadow-glow/10" : ""
          }`}
        >
          <SlidersHorizontal className="h-4.5 w-4.5" />
          {showFilters ? "Hide Filters" : "Advanced Filters"}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="glass-panel p-6 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left shadow-lg">
          {/* Diet select */}
          <div>
            <label className="text-xs text-textGray font-bold uppercase tracking-wider block mb-2">Dietary Category</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsVeg("")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isVeg === ""
                    ? "bg-slate-800 border-accentAmber text-accentAmber shadow-glow/5"
                    : "bg-slate-900 border-slate-750 text-slate-400 hover:border-slate-650"
                }`}
              >
                All Diets
              </button>
              <button
                onClick={() => setIsVeg("true")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isVeg === "true"
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400 shadow-glowGreen/5"
                    : "bg-slate-900 border-slate-750 text-slate-400 hover:border-slate-650"
                }`}
              >
                Veg Only
              </button>
              <button
                onClick={() => setIsVeg("false")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isVeg === "false"
                    ? "bg-red-950/20 border-red-500/30 text-red-400 shadow-glowRed/5"
                    : "bg-slate-900 border-slate-750 text-slate-400 hover:border-slate-650"
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>

          {/* Max Price slider */}
          <div>
            <label className="text-xs text-textGray font-bold uppercase tracking-wider block mb-2">
              Max Price: {maxPrice === 1000 ? "No Limit" : `₹${maxPrice}`}
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accentAmber"
            />
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={() => setMaxPrice(100)}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  maxPrice === 100
                    ? "bg-accentAmber/20 border-accentAmber text-accentAmber"
                    : "bg-slate-900 border-slate-750 text-slate-400 hover:text-slate-200"
                }`}
              >
                ₹100
              </button>
              <button
                type="button"
                onClick={() => setMaxPrice(500)}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  maxPrice === 500
                    ? "bg-accentAmber/20 border-accentAmber text-accentAmber"
                    : "bg-slate-900 border-slate-750 text-slate-400 hover:text-slate-200"
                }`}
              >
                ₹500
              </button>
              <button
                type="button"
                onClick={() => setMaxPrice(1000)}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  maxPrice === 1000
                    ? "bg-accentAmber/20 border-accentAmber text-accentAmber"
                    : "bg-slate-900 border-slate-750 text-slate-400 hover:text-slate-200"
                }`}
              >
                ₹1000+ (No Limit)
              </button>
            </div>
          </div>

          {/* Rating filter */}
          <div>
            <label className="text-xs text-textGray font-bold uppercase tracking-wider block mb-2">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="input-field text-xs py-2 bg-slate-950/80 border-slate-800 focus:border-accentAmber/50"
            >
              <option value="">Show All Ratings</option>
              <option value="4.0">⭐ 4.0 & above</option>
              <option value="4.5">⭐ 4.5 & above</option>
              <option value="4.8">⭐ 4.8 & above</option>
            </select>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex border-b border-slate-850 overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`py-4 px-6 font-heading font-medium text-sm border-b-2 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              category === cat
                ? "border-accentAmber text-accentAmber font-bold"
                : "border-transparent text-textGray hover:text-textLight hover:border-slate-755"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="h-60 flex items-center justify-center text-textGray">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accentAmber mr-3"></div>
          Loading culinary menu...
        </div>
      ) : error ? (
        <div className="glass-panel p-12 text-center text-red-400 text-sm">
          Failed to load food menu. ({error})
        </div>
      ) : foods.length === 0 ? (
        <div className="glass-panel p-16 text-center text-textGray text-sm">
          No food items match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {foods.map((food) => (
            <FoodCard 
              key={food._id} 
              food={food} 
              onOpenDetails={handleOpenDetails} 
            />
          ))}
        </div>
      )}

      {/* Floating Action Cart Trigger */}
      {cartItems.length > 0 && (
        <button
          onClick={() => window.dispatchEvent(new Event("open-cart"))}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-accentAmber to-accentOrange text-white p-4 rounded-full shadow-xl hover:shadow-glow hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2.5 border border-accentAmber/30 animate-pulse"
        >
          <div className="relative">
            <ShoppingBag className="h-5.5 w-5.5" />
            <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white text-[9px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center border border-slate-950">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <span className="text-xs font-bold font-heading pr-1 hidden sm:inline">View Cart</span>
        </button>
      )}

      {/* Detailed Food Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-905 border border-slate-800 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative my-8">
            <button 
              onClick={handleCloseDetails}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-textGray hover:text-white rounded-full cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Food Photo */}
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-950 relative">
              <img 
                src={selectedFood.image} 
                alt={selectedFood.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-4 left-4 bg-slate-950/85 text-accentAmber text-xs font-semibold px-3 py-1 rounded-full border border-slate-800">
                {selectedFood.category}
              </span>
            </div>

            {/* Detailed Info */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div className="space-y-4 text-left">
                <div>
                  <div className="flex items-center gap-1.5 text-accentAmber mb-1 text-sm">
                    <Star className="h-4 w-4 fill-accentAmber" />
                    <span className="font-bold">{selectedFood.rating?.toFixed(1) || "4.5"}</span>
                    <span className="text-textGray text-xs">({selectedFood.reviews?.length || 0} reviews)</span>
                  </div>
                  <h2 className="text-2xl font-extrabold font-heading text-textLight">{selectedFood.name}</h2>
                  <p className="text-xs text-textGray mt-1">Prep Time: {selectedFood.prepTime} Mins | {selectedFood.isVeg ? "🌱 Veg" : "🍗 Non-Veg"}</p>
                </div>

                <p className="text-sm text-textGray leading-relaxed font-sans">{selectedFood.description}</p>
                <div className="text-xl font-bold font-heading text-textLight">₹{selectedFood.price}</div>
              </div>

              {/* Reviews Section */}
              <div className="border-t border-slate-800/80 pt-5 mt-5 space-y-4 text-left">
                <h3 className="font-heading font-semibold text-sm text-textLight flex items-center gap-1.5">
                  <MessageSquare className="h-4.5 w-4.5 text-accentAmber" />
                  Customer Reviews
                </h3>

                {/* Review Form (Only for logged in Customers) */}
                {isAuthenticated && user?.role === "Customer" && (
                  <form onSubmit={handleReviewSubmit} className="space-y-3 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-textGray">Your Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-0.5"
                          >
                            <Star 
                              className={`h-4.5 w-4.5 ${
                                star <= reviewRating ? "text-accentAmber fill-accentAmber" : "text-slate-650"
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="input-field py-1.5 text-xs"
                      />
                      <button 
                        type="submit" 
                        disabled={reviewSubmitting}
                        className="btn-primary py-1.5 px-3 text-xs shrink-0 font-semibold"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-2.5 max-h-40 overflow-y-auto">
                  {selectedFood.reviews?.length === 0 ? (
                    <p className="text-xs text-textGray italic">No reviews yet. Be the first to leave one!</p>
                  ) : (
                    selectedFood.reviews?.map((r, i) => (
                       <div key={i} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 flex flex-col text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-slate-300">{r.userName}</span>
                          <span className="text-[10px] text-accentAmber font-bold flex items-center gap-0.5">
                            ★ {r.rating}
                          </span>
                        </div>
                        <p className="text-textGray leading-relaxed font-sans">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
