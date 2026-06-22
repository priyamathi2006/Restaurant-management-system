import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  Calendar, UserPlus, Sparkles, Clock, CheckCircle, Search, SlidersHorizontal, MapPin, 
  Star, ChevronDown, Check, X, Utensils, Award, Heart
} from "lucide-react";
import ReservationForm from "../components/ReservationForm";
import { api } from "../services/api";

const MOCK_RESTAURANTS = [
  {
    id: "rest_1",
    name: "AB's - Absolute Barbecues",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
    rating: 4.2,
    ratingsCount: "27.1k Ratings",
    location: "Tharamani Road, Velachery",
    priceForTwo: 1700,
    distance: 1.2,
    popularity: 98,
    amenities: ["Buffet", "WiFi", "Serves Alcohol", "Live Music", "Good Place for Kids", "Birthday Parties", "Dine-in"],
    openTime: "Open until 1:30 am",
    offers: "Flat 10% Off on Total Bill",
    tag: "Top Rated",
    reviewSnippet: "Excellent spread of starters, specially the prawns. Friendly staff and fast table service.",
  },
  {
    id: "rest_2",
    name: "Aura Dining",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    ratingsCount: "12.5k Ratings",
    location: "Velachery Main Road, Velachery",
    priceForTwo: 1500,
    distance: 0.5,
    popularity: 99,
    amenities: ["Dine-in", "WiFi", "Vegan Choices Available", "Candle Light Dinner", "Live Music", "Wheel Chair Seating Services"],
    openTime: "Open until 11:00 pm",
    offers: "Flat 15% Off with Bank Cards",
    tag: "Trending",
    reviewSnippet: "Amazing live table visual layout, selected my favorite window seat. Food is absolutely exquisite!",
  },
  {
    id: "rest_3",
    name: "Coal Barbecues",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60",
    rating: 4.5,
    ratingsCount: "18.3k Ratings",
    location: "Velachery Main Road, Velachery",
    priceForTwo: 1600,
    distance: 2.1,
    popularity: 92,
    amenities: ["Buffet", "Dine-in", "WiFi", "Good Place for Kids", "Birthday Parties", "Wheel Chair Seating Services"],
    openTime: "Open until 11:30 pm",
    offers: "Flat 10% Off on Buffet Bookings",
    tag: "Popular",
    reviewSnippet: "Excellent grill spread, particularly the pineapple grill and tandoori prawns. Worth it!",
  },
  {
    id: "rest_4",
    name: "The Great Kabab Factory",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    ratingsCount: "8.9k Ratings",
    location: "Phoenix Marketcity, Velachery",
    priceForTwo: 2200,
    distance: 1.8,
    popularity: 88,
    amenities: ["Buffet", "WiFi", "Serves Alcohol", "Vouchers Accepted", "Dine-in"],
    openTime: "Open until 11:00 pm",
    offers: "Complimentary Chef Special Dessert",
    tag: "Premium Choice",
    reviewSnippet: "Unlimited kababs served at the table. Galouti kabab is a must try here.",
  },
  {
    id: "rest_5",
    name: "Sigree Global Grill",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&auto=format&fit=crop&q=60",
    rating: 3.9,
    ratingsCount: "14.2k Ratings",
    location: "Ganesh Nagar, Velachery",
    priceForTwo: 1400,
    distance: 3.4,
    popularity: 85,
    amenities: ["Buffet", "Dine-in", "WiFi", "Vouchers Accepted", "Wheel Chair Seating Services"],
    openTime: "Open until 11:00 pm",
    offers: "10% Student Discount Available",
    tag: "Value Choice",
    reviewSnippet: "Decent buffet selection. Tandoori items were very soft and tasty.",
  },
  {
    id: "rest_6",
    name: "Rooftop Aura",
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    ratingsCount: "5.4k Ratings",
    location: "100 Feet Road, Velachery",
    priceForTwo: 1800,
    distance: 2.8,
    popularity: 95,
    amenities: ["Rooftop Seating Available", "Candle Light Dinner", "WiFi", "Serves Alcohol", "Live Music", "Dine-in", "Outdoor Seating"],
    openTime: "Open until 12:00 am",
    offers: "Flat 10% Off on Rooftop Bookings",
    tag: "Romantic Vibe",
    reviewSnippet: "Stunning night view of the city. Perfect candle light dinner spot with live violin music.",
  }
];

const AMENITY_OPTIONS = [
  "Buffet", "WiFi", "Serves Alcohol", "Live Music", "Outdoor Seating", 
  "Wheel Chair Seating Services", "Vouchers Accepted", "Dine-in", 
  "Good Place for Kids", "Rooftop Seating Available", "Candle Light Dinner", 
  "Birthday Parties", "Vegan Choices Available"
];

const PRICE_RANGES = [
  { label: "Under ₹1000", value: "0-1000" },
  { label: "₹1000 - ₹2000", value: "1000-2000" },
  { label: "Over ₹2000", value: "2000-9999" }
];

const RATING_OPTIONS = [
  { label: "Any Rating", value: "" },
  { label: "3.5+ Rating", value: "3.5" },
  { label: "4.0+ Rating", value: "4.0" },
  { label: "4.5+ Rating", value: "4.5" }
];

export default function Reservation() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Core Data States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successReservation, setSuccessReservation] = useState(null);
  const [myReservations, setMyReservations] = useState([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Relevance"); // Relevance, Rating, Popularity, Distance, Price
  const [priceRange, setPriceRange] = useState("");
  const [minRating, setMinRating] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  // Desktop Dropdown Open States
  const [activeDropdown, setActiveDropdown] = useState(null); // 'sort', 'price', 'rating', 'amenities'

  // Mobile Filter Drawer State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Booking Modal State
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Favorites Simulation State
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (restId, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (favorites.includes(restId)) {
      setFavorites(favorites.filter(id => id !== restId));
    } else {
      setFavorites([...favorites, restId]);
    }
  };

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
    if (!selectedRestaurant) return;
    try {
      setLoading(true);
      setError("");
      setSuccessReservation(null);

      // Prepend selected restaurant name in specialRequests to persist selection
      const enrichedData = {
        ...formData,
        specialRequests: `[Restaurant: ${selectedRestaurant.name}] ${formData.specialRequests || ""}`
      };

      const res = await api.post("/reservations", enrichedData);

      if (res.success) {
        setSuccessReservation(res.reservation);
        setSelectedRestaurant(null); // Close modal
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

  const parseSpecialRequests = (reqString) => {
    if (!reqString) return { restaurant: "Aura Dining", notes: "" };
    const match = reqString.match(/^\[Restaurant:\s*(.*?)\]\s*(.*)$/);
    if (match) {
      return { restaurant: match[1], notes: match[2] };
    }
    return { restaurant: "Aura Dining", notes: reqString };
  };

  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSortBy("Relevance");
    setPriceRange("");
    setMinRating("");
    setSelectedAmenities([]);
  };

  // Filter & Sort Logic
  const filteredRestaurants = MOCK_RESTAURANTS.filter((rest) => {
    // 1. Search Query
    const query = searchQuery.toLowerCase();
    const matchesSearch = rest.name.toLowerCase().includes(query) || rest.location.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    // 2. Rating Filter
    if (minRating && rest.rating < parseFloat(minRating)) return false;

    // 3. Price Filter
    if (priceRange) {
      const [low, high] = priceRange.split("-").map(Number);
      if (rest.priceForTwo < low || rest.priceForTwo > high) return false;
    }

    // 4. Amenities Filter
    if (selectedAmenities.length > 0) {
      const hasAllAmenities = selectedAmenities.every(amenity => rest.amenities.includes(amenity));
      if (!hasAllAmenities) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === "Rating") return b.rating - a.rating;
    if (sortBy === "Popularity") return b.popularity - a.popularity;
    if (sortBy === "Distance") return a.distance - b.distance;
    if (sortBy === "Price") return a.priceForTwo - b.priceForTwo;
    return 0; // Default Relevance
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left relative">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 p-8 sm:p-10 text-center space-y-4 shadow-glow/5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accentAmber/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accentOrange/5 rounded-full blur-3xl pointer-events-none" />
        
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900/90 text-accentAmber text-xs font-semibold uppercase tracking-widest rounded-full border border-slate-800">
          <Sparkles className="h-4 w-4 animate-spin-slow" /> Instant Table Bookings
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight text-textLight">
          Find and Book <span className="bg-gradient-to-r from-accentAmber to-accentOrange bg-clip-text text-transparent">Dining Tables</span>
        </h1>
        <p className="text-textGray text-sm max-w-lg mx-auto leading-relaxed">
          Book tables visually in top restaurants. Filter by rating, price, distance, or amenities and reserve your seating floor slot instantly.
        </p>
      </div>

      {/* Control Area (Search and Filters) */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Search bar with location mockup */}
          <div className="relative flex-1 max-w-xl flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1 focus-within:border-accentAmber/40 focus-within:shadow-glow/5 transition-all">
          <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search restaurant names, cuisines, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 ring-0 outline-none text-xs pl-10 pr-4 py-2 text-textLight placeholder-slate-500 font-sans"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            </div>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="p-1.5 text-textGray hover:text-textLight mr-1.5">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Filters Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex-1 btn-secondary py-3 px-4 text-xs font-bold flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4 text-accentAmber" />
              Filters & Sort
            </button>

            {(searchQuery || sortBy !== "Relevance" || priceRange || minRating || selectedAmenities.length > 0) && (
              <button 
                onClick={clearAllFilters}
                className="text-xs text-accentAmber hover:text-accentOrange font-semibold transition-all px-3 py-2 bg-accentAmber/5 rounded-xl border border-accentAmber/10 hover:border-accentAmber/30 shrink-0"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Desktop Filter Row */}
        <div className="hidden md:flex flex-wrap items-center gap-3 relative z-30">
          
          {/* Filter Dialog Button: Sort By */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "sort" ? null : "sort")}
              className={`px-4 py-2 text-xs font-semibold rounded-full border flex items-center gap-1.5 transition-all bg-slate-900 ${
                sortBy !== "Relevance" ? "border-accentAmber text-accentAmber" : "border-slate-800 text-textGray hover:text-textLight hover:border-slate-700"
              }`}
            >
              Sort By: <span className="text-textLight font-bold">{sortBy}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {activeDropdown === "sort" && (
              <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {["Relevance", "Rating", "Popularity", "Distance", "Price"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setActiveDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-textGray hover:text-textLight hover:bg-slate-800/80 transition-all"
                  >
                    {opt}
                    {sortBy === opt && <Check className="h-3.5 w-3.5 text-accentAmber" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Dialog Button: Price Range */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "price" ? null : "price")}
              className={`px-4 py-2 text-xs font-semibold rounded-full border flex items-center gap-1.5 transition-all bg-slate-900 ${
                priceRange ? "border-accentAmber text-accentAmber" : "border-slate-800 text-textGray hover:text-textLight hover:border-slate-700"
              }`}
            >
              Price: <span className="text-textLight font-bold">
                {priceRange ? PRICE_RANGES.find(p => p.value === priceRange)?.label : "Any"}
              </span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {activeDropdown === "price" && (
              <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl space-y-1 z-30">
                <button
                  onClick={() => { setPriceRange(""); setActiveDropdown(null); }}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-textGray hover:text-textLight hover:bg-slate-800/80 transition-all"
                >
                  Any Price
                  {!priceRange && <Check className="h-3.5 w-3.5 text-accentAmber" />}
                </button>
                {PRICE_RANGES.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setPriceRange(opt.value); setActiveDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-textGray hover:text-textLight hover:bg-slate-800/80 transition-all"
                  >
                    {opt.label}
                    {priceRange === opt.value && <Check className="h-3.5 w-3.5 text-accentAmber" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Dialog Button: Ratings */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "rating" ? null : "rating")}
              className={`px-4 py-2 text-xs font-semibold rounded-full border flex items-center gap-1.5 transition-all bg-slate-900 ${
                minRating ? "border-accentAmber text-accentAmber" : "border-slate-800 text-textGray hover:text-textLight hover:border-slate-700"
              }`}
            >
              Rating: <span className="text-textLight font-bold">
                {minRating ? `${minRating} & above` : "Any"}
              </span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {activeDropdown === "rating" && (
              <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl space-y-1 z-30">
                {RATING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setMinRating(opt.value); setActiveDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-textGray hover:text-textLight hover:bg-slate-800/80 transition-all"
                  >
                    {opt.label}
                    {minRating === opt.value && <Check className="h-3.5 w-3.5 text-accentAmber" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Dialog Button: Amenities */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "amenities" ? null : "amenities")}
              className={`px-4 py-2 text-xs font-semibold rounded-full border flex items-center gap-1.5 transition-all bg-slate-900 ${
                selectedAmenities.length > 0 ? "border-accentAmber text-accentAmber" : "border-slate-800 text-textGray hover:text-textLight hover:border-slate-700"
              }`}
            >
              Amenities
              {selectedAmenities.length > 0 && (
                <span className="h-4.5 w-4.5 bg-accentAmber text-slate-950 font-bold rounded-full flex items-center justify-center text-[10px]">
                  {selectedAmenities.length}
                </span>
              )}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {activeDropdown === "amenities" && (
              <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 p-3 shadow-2xl space-y-2 z-35 max-h-72 overflow-y-auto">
                <p className="text-[10px] text-textGray uppercase font-bold tracking-wider px-1">Select Amenities</p>
                <div className="space-y-1">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 text-textGray hover:text-textLight hover:bg-slate-800 transition-all"
                      >
                        <div className={`h-4 w-4 border rounded flex items-center justify-center transition-all ${
                          isChecked ? "bg-accentAmber border-accentAmber text-slate-950" : "border-slate-700"
                        }`}>
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick toggle chips */}
          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Buffet Quick Filter */}
          <button
            onClick={() => handleAmenityToggle("Buffet")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selectedAmenities.includes("Buffet")
                ? "bg-accentAmber/10 border-accentAmber text-accentAmber"
                : "bg-slate-900 border-slate-800 text-textGray hover:border-slate-700 hover:text-textLight"
            }`}
          >
            🍛 Buffet
          </button>

          {/* Serves Alcohol Quick Filter */}
          <button
            onClick={() => handleAmenityToggle("Serves Alcohol")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selectedAmenities.includes("Serves Alcohol")
                ? "bg-accentAmber/10 border-accentAmber text-accentAmber"
                : "bg-slate-900 border-slate-800 text-textGray hover:border-slate-700 hover:text-textLight"
            }`}
          >
            🍷 Serves Alcohol
          </button>

          {/* Live Music Quick Filter */}
          <button
            onClick={() => handleAmenityToggle("Live Music")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selectedAmenities.includes("Live Music")
                ? "bg-accentAmber/10 border-accentAmber text-accentAmber"
                : "bg-slate-900 border-slate-800 text-textGray hover:border-slate-700 hover:text-textLight"
            }`}
          >
            🎸 Live Music
          </button>
        </div>
      </div>

      {/* Backdrop for closing active dropdowns on desktop */}
      {activeDropdown && (
        <div className="fixed inset-0 z-20" onClick={() => setActiveDropdown(null)} />
      )}

      {/* Main Listing Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="glass-panel p-20 text-center space-y-4 border-slate-800/80">
          <Utensils className="h-12 w-12 text-slate-700 mx-auto animate-pulse" />
          <h3 className="font-heading font-bold text-lg text-textLight">No Restaurants Match</h3>
          <p className="text-textGray text-xs max-w-xs mx-auto">We couldn't find any dining locations matching your search or filters. Try adjusting your selections!</p>
          <button 
            onClick={clearAllFilters}
            className="btn-primary py-2 px-6 text-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((rest) => {
            const isFav = favorites.includes(rest.id);
            return (
              <div 
                key={rest.id}
                className="glass-card flex flex-col overflow-hidden text-left hover:shadow-glow/5 group hover:border-slate-750 transition-all duration-300"
              >
                {/* Photo Header */}
                <div className="h-56 relative overflow-hidden bg-slate-950 shrink-0">
                  <img 
                    src={rest.image} 
                    alt={rest.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {/* Backdrop Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/35 pointer-events-none" />
                  
                  {/* Floating Tags */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="px-3 py-1 bg-slate-950/85 border border-slate-850 text-accentAmber text-[9px] font-extrabold uppercase tracking-wider rounded-xl backdrop-blur-sm flex items-center gap-1 shadow-md">
                      <Award className="h-3 w-3" />
                      {rest.tag}
                    </span>
                    {rest.distance < 1.0 && (
                      <span className="px-2 py-0.5 bg-emerald-500/90 text-slate-950 text-[9px] font-extrabold uppercase rounded-lg w-fit">
                        Nearby
                      </span>
                    )}
                  </div>

                  {/* Favorite Toggle button */}
                  <button
                    onClick={(e) => toggleFavorite(rest.id, e)}
                    className="absolute top-4 right-4 p-2 rounded-full border backdrop-blur-sm bg-slate-950/50 hover:bg-slate-900 border-slate-800/40 hover:border-red-500/25 transition-all text-textGray hover:text-red-400 cursor-pointer"
                  >
                    <Heart className={`h-4.5 w-4.5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                  </button>

                  {/* Distance badge bottom right */}
                  <span className="absolute bottom-4 right-4 px-2.5 py-1 bg-slate-900/95 border border-slate-800 text-[10px] font-bold text-textLight rounded-lg">
                    {rest.distance} km away
                  </span>
                </div>

                {/* Card Details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Title and Rating Row */}
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-extrabold font-heading text-textLight tracking-tight group-hover:text-accentAmber transition-colors line-clamp-1">
                        {rest.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-lg text-[11px] shrink-0">
                        <span>{rest.rating}</span>
                        <Star className="h-3 w-3 fill-current shrink-0" />
                      </div>
                    </div>

                    {/* Address/Location */}
                    <p className="text-xs text-textGray font-semibold flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      {rest.location}
                    </p>

                    {/* Price and Schedule */}
                    <div className="flex justify-between items-center text-xs text-slate-300 font-medium">
                      <span>₹{rest.priceForTwo} for two</span>
                      <span className="text-textGray font-semibold">{rest.openTime}</span>
                    </div>

                    {/* Offers Banner */}
                    <div className="bg-accentAmber/5 border border-accentAmber/20 p-2 rounded-xl flex items-center gap-1.5 text-[10px] font-semibold text-accentAmber mt-1">
                      <span className="bg-accentAmber text-slate-950 font-bold text-[8px] uppercase px-1 rounded">Offer</span>
                      <span>{rest.offers}</span>
                    </div>

                    {/* Review highlight snippet */}
                    <p className="text-[11px] text-textGray italic leading-relaxed pt-1 line-clamp-2 border-t border-slate-850">
                      "{rest.reviewSnippet}"
                    </p>
                  </div>

                  {/* Actions Row */}
                  <button 
                    onClick={() => setSelectedRestaurant(rest)}
                    className="w-full btn-primary py-2.5 text-xs font-bold font-heading uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-glow/15"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Table (Visual Map)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reservation History Section */}
      {isAuthenticated && myReservations.length > 0 && (
        <div className="space-y-4 pt-10 border-t border-slate-850">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-heading text-textLight">My Booking History</h2>
            <span className="text-xs text-textGray font-semibold">{myReservations.length} total bookings</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myReservations.map((res) => {
              const { restaurant, notes } = parseSpecialRequests(res.specialRequests);
              return (
                <div 
                  key={res._id}
                  className="bg-slate-900/60 p-4.5 rounded-2xl border border-slate-850 flex items-center justify-between gap-4 hover:border-slate-800 transition-all text-left"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-sm font-bold text-textLight truncate">{restaurant}</p>
                    <p className="text-[11px] text-textGray font-medium">Table #{res.tableNumber} ({res.guests} Guests)</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {new Date(res.reservationDate).toLocaleDateString()} at{" "}
                      {new Date(res.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {notes && (
                      <p className="text-[10px] text-textGray truncate italic mt-1 border-t border-slate-800/40 pt-1">
                        "{notes}"
                      </p>
                    )}
                  </div>
                  
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
                    res.status === "Confirmed"
                      ? "bg-emerald-950/30 border-emerald-500/25 text-emerald-400"
                      : res.status === "Cancelled"
                      ? "bg-red-950/30 border-red-500/25 text-red-400"
                      : "bg-amber-950/30 border-amber-500/25 text-accentAmber animate-pulse"
                  }`}>
                    {res.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Table Selector Modal overlay */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => { setSelectedRestaurant(null); setError(""); }}
              className="absolute top-4 right-4 text-textGray hover:text-textLight p-1.5 hover:bg-slate-800 rounded-xl transition-all cursor-pointer z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-800 pb-4 pr-8">
              <span className="text-[10px] uppercase font-bold text-accentAmber tracking-wider">Table Booking Floor Map</span>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-textLight mt-0.5">{selectedRestaurant.name}</h2>
              <p className="text-xs text-textGray mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" /> {selectedRestaurant.location}
              </p>
            </div>

            {/* Modal Body (Reservation Form with Floor Plan) */}
            <div className="pt-2">
              <ReservationForm 
                onSubmitReservation={handleSubmitReservation} 
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Modal overlay */}
      {successReservation && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-8 text-center space-y-5 max-w-md w-full border border-emerald-500/20 shadow-glowGreen/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto bg-emerald-500/10 p-4 rounded-full w-fit text-emerald-400">
              <CheckCircle className="h-10 w-10 animate-bounce" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-textLight">Reservation Confirmed!</h3>
              <p className="text-textGray text-xs mt-1">Your reservation has been created and logged in the booking catalog.</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-left text-sm space-y-2 text-slate-300">
              <p>• <strong>Restaurant:</strong> {parseSpecialRequests(successReservation.specialRequests).restaurant}</p>
              <p>• <strong>Table Assigned:</strong> Table #{successReservation.tableNumber}</p>
              <p>• <strong>Guests:</strong> {successReservation.guests} Seater</p>
              <p>• <strong>Date:</strong> {new Date(successReservation.reservationDate).toLocaleDateString()}</p>
              <p>• <strong>Time Slot:</strong> {new Date(successReservation.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <button 
              onClick={() => setSuccessReservation(null)}
              className="btn-secondary w-full py-2.5 text-sm font-bold uppercase tracking-wider"
            >
              Back to Dining Listings
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Filter Dialog Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Drawer backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          
          {/* Drawer sheet */}
          <div className="relative w-80 h-full bg-slate-900 border-l border-slate-850 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-6 overflow-y-auto max-h-[85vh] pr-2">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <h3 className="text-lg font-extrabold font-heading text-textLight">Filters & Sort</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-textGray hover:text-textLight p-1 hover:bg-slate-800 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sort By section */}
              <div className="space-y-2 text-left">
                <p className="text-xs text-textGray font-bold uppercase tracking-wider">Sort Restaurants By</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Relevance", "Rating", "Popularity", "Distance", "Price"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSortBy(opt)}
                      className={`py-2 px-3 rounded-xl text-center text-xs font-semibold border transition-all ${
                        sortBy === opt
                          ? "bg-accentAmber/10 border-accentAmber text-accentAmber"
                          : "bg-slate-950 border-slate-800 text-textGray"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Section */}
              <div className="space-y-2 text-left">
                <p className="text-xs text-textGray font-bold uppercase tracking-wider">Average Price Range</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setPriceRange("")}
                    className={`py-2 px-3 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                      !priceRange ? "bg-accentAmber/10 border-accentAmber text-accentAmber" : "bg-slate-950 border-slate-800 text-textGray"
                    }`}
                  >
                    Any Price
                    {!priceRange && <Check className="h-4 w-4" />}
                  </button>
                  {PRICE_RANGES.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPriceRange(opt.value)}
                      className={`py-2 px-3 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                        priceRange === opt.value ? "bg-accentAmber/10 border-accentAmber text-accentAmber" : "bg-slate-950 border-slate-800 text-textGray"
                      }`}
                    >
                      {opt.label}
                      {priceRange === opt.value && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ratings selection */}
              <div className="space-y-2 text-left">
                <p className="text-xs text-textGray font-bold uppercase tracking-wider">Minimum Rating</p>
                <div className="grid grid-cols-2 gap-2">
                  {RATING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMinRating(opt.value)}
                      className={`py-2 px-3 rounded-xl text-center text-xs font-semibold border transition-all ${
                        minRating === opt.value
                          ? "bg-accentAmber/10 border-accentAmber text-accentAmber"
                          : "bg-slate-950 border-slate-800 text-textGray"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities checkboxes */}
              <div className="space-y-2 text-left">
                <p className="text-xs text-textGray font-bold uppercase tracking-wider">Amenities & Features</p>
                <div className="space-y-2.5 max-h-48 overflow-y-auto bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        className="w-full text-left flex items-center gap-2.5 text-xs text-textGray hover:text-textLight font-semibold"
                      >
                        <div className={`h-4.5 w-4.5 border rounded flex items-center justify-center shrink-0 transition-all ${
                          isChecked ? "bg-accentAmber border-accentAmber text-slate-950" : "border-slate-800 bg-slate-900"
                        }`}>
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Apply actions */}
            <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 bg-slate-900">
              <button
                onClick={() => { clearAllFilters(); setMobileFiltersOpen(false); }}
                className="py-3 text-center text-xs font-bold text-textGray hover:bg-slate-800/60 rounded-xl border border-slate-800"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-primary py-3 text-center text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
