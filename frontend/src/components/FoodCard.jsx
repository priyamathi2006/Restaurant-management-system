import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, Clock, Plus, Minus, Leaf } from "lucide-react";
import { addToCart, removeFromCart, updateQuantity } from "../redux/slices/cartSlice";

export default function FoodCard({ food, onOpenDetails }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  
  const cartItem = cartItems.find((item) => item.foodId === food._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e) => {
    e.stopPropagation(); // Avoid opening details modal
    dispatch(addToCart(food));
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    dispatch(updateQuantity({ foodId: food._id, quantity: quantity + 1 }));
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity === 1) {
      dispatch(removeFromCart(food._id));
    } else {
      dispatch(updateQuantity({ foodId: food._id, quantity: quantity - 1 }));
    }
  };

  return (
    <div 
      onClick={() => onOpenDetails && onOpenDetails(food)}
      className="glass-card flex flex-col h-full overflow-hidden cursor-pointer group hover:shadow-glow/15 hover:border-accentAmber/35 hover:-translate-y-1.5 transition-all duration-300 ease-out"
    >
      {/* Food Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img 
          src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Category Overlay */}
        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-xs px-2.5 py-1 rounded-full border border-slate-700/50 font-medium">
          {food.category}
        </span>

        {/* Veg/Non-Veg Badge */}
        <span 
          className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-md border ${
            food.isVeg 
              ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-400" 
              : "bg-red-950/80 border-red-500/30 text-red-400"
          }`}
          title={food.isVeg ? "Vegetarian" : "Non-Vegetarian"}
        >
          <Leaf className="h-4.5 w-4.5 fill-current" />
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Rating and Prep Time */}
        <div className="flex items-center justify-between text-xs text-textGray mb-2.5">
          <div className="flex items-center gap-1">
            <Star className="h-4.5 w-4.5 text-accentAmber fill-accentAmber" />
            <span className="text-textLight font-bold text-sm">{food.rating ? food.rating.toFixed(1) : "4.5"}</span>
            <span className="text-textGray">({food.reviews?.length || 0})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-textGray" />
            <span>{food.prepTime} Mins</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-textLight text-lg font-bold font-heading mb-1.5 line-clamp-1 group-hover:text-accentAmber transition-colors">
          {food.name}
        </h3>
        <p className="text-textGray text-sm line-clamp-2 leading-relaxed mb-4 flex-grow">
          {food.description || "Freshly prepared gourmet dish made with premium, select ingredients."}
        </p>

        {/* Price & Cart Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <span className="text-xl font-bold font-heading text-textLight">
            ₹{food.price}
          </span>

          {quantity > 0 ? (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-2 py-1"
            >
              <button 
                onClick={handleDecrement}
                className="p-1 hover:text-red-400 active:scale-95 transition-all cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-bold text-textLight px-3 select-none">
                {quantity}
              </span>
              <button 
                onClick={handleIncrement}
                className="p-1 hover:text-emerald-400 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAdd}
              className="bg-slate-800 hover:bg-accentAmber hover:text-white text-accentAmber border border-slate-700 hover:border-accentAmber rounded-xl p-2.5 transition-all duration-200 cursor-pointer"
              title="Add to Cart"
            >
              <Plus className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
