const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Food = require("../models/Food");
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });

const usersData = [
  {
    name: "System Admin",
    email: "admin@restaurant.com",
    password: "admin123",
    role: "Admin",
    phone: "9876543210",
    address: "Restaurant Main Branch HQ",
  },
  {
    name: "Head Chef Marco",
    email: "chef@restaurant.com",
    password: "chef123",
    role: "Chef",
    phone: "9876543211",
    address: "Main Kitchen Station A",
  },
  {
    name: "Express Delivery",
    email: "delivery@restaurant.com",
    password: "delivery123",
    role: "Delivery",
    phone: "9876543212",
    address: "Rider Transit Hub 1",
  },
  {
    name: "Jane Customer",
    email: "customer@restaurant.com",
    password: "customer123",
    role: "Customer",
    phone: "9876543213",
    address: "42 Wallaby Way, Sydney",
  },
];

const foodsData = [
  // Starters
  {
    name: "Garlic Bread with Cheese",
    category: "Starters",
    price: 180,
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    description: "Toasted French baguette brushed with garlic butter, topped with melted mozzarella cheese and oregano.",
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
    reviews: [
      { userName: "Alex", rating: 5, comment: "Super cheesy and crisp!" },
      { userName: "Mia", rating: 4, comment: "Loved the garlic aroma." }
    ]
  },
  {
    name: "Crispy Spring Rolls",
    category: "Starters",
    price: 220,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
    rating: 4.4,
    description: "Stuffed with glass noodles and sautéed mixed vegetables, fried to golden crispiness and served with sweet chili sauce.",
    isVeg: true,
    isAvailable: true,
    prepTime: 12,
    reviews: [
      { userName: "Emma", rating: 4, comment: "Very crunchy and tasty." }
    ]
  },
  {
    name: "Tandoori Paneer Tikka",
    category: "Starters",
    price: 280,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "Fresh cottage cheese cubes marinated in yogurt and spices, skewed with bell peppers and onions, cooked in a tandoor.",
    isVeg: true,
    isAvailable: true,
    prepTime: 15,
  },
  {
    name: "Spicy Buffalo Wings",
    category: "Starters",
    price: 320,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    description: "Deep-fried chicken wings tossed in signature spicy buffalo sauce, served with blue cheese dip.",
    isVeg: false,
    isAvailable: true,
    prepTime: 14,
  },

  // Main Course
  {
    name: "Rich Butter Chicken",
    category: "Main Course",
    price: 450,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    description: "Tender tandoori chicken pieces cooked in a smooth, creamy tomato-butter sauce with aromatic spices.",
    isVeg: false,
    isAvailable: true,
    prepTime: 20,
    reviews: [
      { userName: "Sam", rating: 5, comment: "Out of this world! Best butter chicken." }
    ]
  },
  {
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 380,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    description: "Succulent paneer cubes simmered in a rich, buttery onion-tomato gravy with cashew paste.",
    isVeg: true,
    isAvailable: true,
    prepTime: 18,
  },
  {
    name: "Garden Veggie Pizza",
    category: "Main Course",
    price: 399,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
    rating: 4.5,
    description: "Stone-baked thin crust pizza topped with marinara sauce, loaded with bell peppers, olives, mushrooms, onions, and extra mozzarella.",
    isVeg: true,
    isAvailable: true,
    prepTime: 15,
  },
  {
    name: "Gourmet Beef Burger",
    category: "Main Course",
    price: 340,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    description: "Char-grilled beef patty, cheddar cheese, caramelized onions, fresh lettuce, tomatoes, and custom burger sauce in a brioche bun.",
    isVeg: false,
    isAvailable: true,
    prepTime: 12,
  },

  // Desserts
  {
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 240,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    description: "Decadent dark chocolate cake with a molten chocolate center, served warm with vanilla ice cream.",
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
    reviews: [
      { userName: "Sara", rating: 5, comment: "Fabulous molten chocolate. Pure heaven!" }
    ]
  },
  {
    name: "Classic New York Cheesecake",
    category: "Desserts",
    price: 260,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "Rich and creamy baked cheesecake on a buttery graham cracker crust, topped with fresh strawberry compote.",
    isVeg: true,
    isAvailable: true,
    prepTime: 8,
  },
  {
    name: "Hot Fudge Sundae",
    category: "Desserts",
    price: 190,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60",
    rating: 4.4,
    description: "Three scoops of vanilla bean ice cream topped with hot fudge sauce, whipped cream, chopped nuts, and a cherry.",
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
  },

  // Beverages
  {
    name: "Fresh Mint Virgin Mojito",
    category: "Beverages",
    price: 140,
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60",
    rating: 4.5,
    description: "A refreshing blend of fresh mint leaves, lime juice, brown sugar, and crushed ice, topped with sparkling club soda.",
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
  },
  {
    name: "Iced Caramel Macchiato",
    category: "Beverages",
    price: 180,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    description: "Rich espresso combined with milk and sweet vanilla syrup, served over ice and drizzled with buttery caramel sauce.",
    isVeg: true,
    isAvailable: true,
    prepTime: 6,
  },
  {
    name: "Traditional Mango Lassi",
    category: "Beverages",
    price: 150,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "A creamy and refreshing sweet yogurt drink blended with fresh ripe mango pulp, cardamom, and saffron.",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Chili Cheese Toast",
    category: "Starters",
    price: 199,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=60",
    rating: 4.5,
    description: "Crispy toasted sourdough slices topped with a spicy blend of cheddar cheese, chopped green chilies, and fresh herbs.",
    isVeg: true,
    isAvailable: true,
    prepTime: 8,
  },
  {
    name: "Crispy Chicken Lollipop",
    category: "Starters",
    price: 310,
    image: "https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    description: "Deep-fried chicken wings marinated in a rich Indo-Chinese spice batter, served with spicy hot garlic schezwan dipping sauce.",
    isVeg: false,
    isAvailable: true,
    prepTime: 15,
  },
  {
    name: "Hyderabadi Chicken Biryani",
    category: "Main Course",
    price: 480,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    description: "Aromatic basmati rice slowly steam-cooked (dum) with tender marinated chicken pieces, whole spices, saffron, and fresh mint.",
    isVeg: false,
    isAvailable: true,
    prepTime: 22,
  },
  {
    name: "Creamy Alfredo Pasta",
    category: "Main Course",
    price: 360,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    description: "Fettuccine pasta tossed in a rich, buttery parmesan cream sauce, flavored with minced garlic and cracked black pepper.",
    isVeg: true,
    isAvailable: true,
    prepTime: 14,
  },
  {
    name: "Warm Apple Pie",
    category: "Desserts",
    price: 220,
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=500&auto=format&fit=crop&q=60",
    rating: 4.5,
    description: "Flaky puff pastry filled with caramelized cinnamon-spiced apples, served warm with a scoop of vanilla bean ice cream.",
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
  },
  {
    name: "Gulab Jamun with Ice Cream",
    category: "Desserts",
    price: 180,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "Soft milk-solid dumplings fried to a golden brown, soaked in aromatic cardamom-infused sugar syrup, paired with chilled vanilla ice cream.",
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
  },
  {
    name: "Blue Lagoon Mocktail",
    category: "Beverages",
    price: 160,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&auto=format&fit=crop&q=60",
    rating: 4.4,
    description: "A vibrant refreshing drink blended with blue curaçao syrup, lime juice, mint leaves, sprite, and lots of crushed ice.",
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
  },
  {
    name: "Classic Cappuccino",
    category: "Beverages",
    price: 140,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    description: "Rich full-bodied espresso topped with a thick, velvety layer of aerated warm milk foam and a sprinkle of dark cocoa powder.",
    isVeg: true,
    isAvailable: true,
    prepTime: 6,
  },
  {
    name: "Chicken 65",
    category: "Starters",
    price: 260,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "Deep-fried spicy, crisp chicken pieces marinated with curry leaves, ginger, garlic, and hot South Indian spices.",
    isVeg: false,
    isAvailable: true,
    prepTime: 12,
  },
  {
    name: "Chilli Chicken",
    category: "Starters",
    price: 280,
    image: "https://images.unsplash.com/photo-1598515213692-5f252f75d785?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    description: "Tender chicken chunks tossed in a sweet, spicy, and tangy Indo-Chinese sauce with onions and bell peppers.",
    isVeg: false,
    isAvailable: true,
    prepTime: 14,
  },
  {
    name: "Mutton Chukka",
    category: "Starters",
    price: 380,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    description: "Slow-roasted tender mutton pieces cooked with shallots, curry leaves, and a fiery freshly-ground pepper spice blend.",
    isVeg: false,
    isAvailable: true,
    prepTime: 20,
  },
  {
    name: "Fish Fry",
    category: "Starters",
    price: 320,
    image: "https://images.unsplash.com/photo-1535398089889-183cf9e6900f?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    description: "Fresh fish slices coated in an aromatic tawa masala paste, shallow-fried to crispy golden perfection.",
    isVeg: false,
    isAvailable: true,
    prepTime: 10,
  },
  {
    name: "Chicken Biryani",
    category: "Main Course",
    price: 350,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "Delicious basmati rice cooked with succulent chicken pieces, whole spices, saffron, and fresh herbs.",
    isVeg: false,
    isAvailable: true,
    prepTime: 18,
  },
  {
    name: "Mutton Biryani",
    category: "Main Course",
    price: 450,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    description: "Rich and aromatic layered rice dish containing extremely tender mutton pieces cooked slow in a traditional handi.",
    isVeg: false,
    isAvailable: true,
    prepTime: 20,
  },
  {
    name: "Butter Chicken Masala",
    category: "Main Course",
    price: 420,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "Tender tandoori chicken cooked in a rich, buttery, and mildly sweet tomato cream sauce.",
    isVeg: false,
    isAvailable: true,
    prepTime: 16,
  },
  {
    name: "Egg Curry",
    category: "Main Course",
    price: 240,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=60",
    rating: 4.5,
    description: "Boiled eggs simmered in a flavorful onion-tomato gravy with curry leaves and classic Indian spices.",
    isVeg: false,
    isAvailable: true,
    prepTime: 12,
  },
  {
    name: "Prawn Masala",
    category: "Main Course",
    price: 390,
    image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    description: "Fresh prawns sautéed in a thick, semi-dry spicy masala paste with onions, ginger, garlic, and fresh coriander.",
    isVeg: false,
    isAvailable: true,
    prepTime: 14,
  },
  {
    name: "Chicken Fried Rice",
    category: "Main Course",
    price: 280,
    image: "https://images.unsplash.com/photo-1603133872878-685f5885c3e5?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    description: "Wok-tossed basmati rice scrambled with tender chicken shreds, fresh eggs, green peas, carrots, and soy sauce.",
    isVeg: false,
    isAvailable: true,
    prepTime: 12,
  },
  {
    name: "Paneer 65",
    category: "Starters",
    price: 240,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    description: "Deep-fried crispy cottage cheese cubes marinated in yogurt and red chili spices, garnished with curry leaves.",
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
  },
  {
    name: "Crispy Honey Chili Potatoes",
    category: "Starters",
    price: 220,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=60",
    rating: 4.5,
    description: "Deep-fried potato fingers tossed in a sweet and spicy honey chili sauce, sprinkled with toasted sesame seeds.",
    isVeg: true,
    isAvailable: true,
    prepTime: 12,
  },
  {
    name: "Vegetable Manchurian Dry",
    category: "Starters",
    price: 210,
    image: "https://images.unsplash.com/photo-1598515213692-5f252f75d785?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    description: "Crispy fried vegetable balls tossed in a dark soy and chili garlic sauce, finished with spring onions.",
    isVeg: true,
    isAvailable: true,
    prepTime: 12,
  },
  {
    name: "Stuffed Mushroom Caps",
    category: "Starters",
    price: 260,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    description: "Baked button mushroom caps filled with creamy garlic cheese, spinach, and finely chopped herbs.",
    isVeg: true,
    isAvailable: true,
    prepTime: 15,
  },
  {
    name: "Lemon Garlic Butter Shrimp",
    category: "Starters",
    price: 380,
    image: "https://images.unsplash.com/photo-1535398089889-183cf9e6900f?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "Tender pan-seared shrimp tossed in a rich butter sauce with fresh lemon juice, garlic, and chopped parsley.",
    isVeg: false,
    isAvailable: true,
    prepTime: 12,
  },
  {
    name: "Crispy Fried Chicken Wings",
    category: "Starters",
    price: 290,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    description: "Deep-fried chicken wings coated in a crispy garlic batter, served with spicy dip.",
    isVeg: false,
    isAvailable: true,
    prepTime: 12,
  },
  {
    name: "Mutton Seekh Kebab",
    category: "Starters",
    price: 420,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    description: "Spiced minced mutton skewered and char-grilled in a tandoor, served with mint chutney.",
    isVeg: false,
    isAvailable: true,
    prepTime: 15,
  },
  {
    name: "Dal Makhani with Butter Naan",
    category: "Main Course",
    price: 320,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "Slow-cooked black lentils in rich cream and butter, paired with fresh clay-oven buttered naan.",
    isVeg: true,
    isAvailable: true,
    prepTime: 18,
  },
  {
    name: "Vegetable Kadhai Masala",
    category: "Main Course",
    price: 290,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    description: "Assorted vegetables cooked in a spicy kadhai gravy with freshly ground coriander and red chilies.",
    isVeg: true,
    isAvailable: true,
    prepTime: 15,
  },
  {
    name: "Mushroom Risotto",
    category: "Main Course",
    price: 399,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    description: "Creamy Italian arborio rice simmered with wild button mushrooms, garlic, white wine, and parmesan cheese.",
    isVeg: true,
    isAvailable: true,
    prepTime: 16,
  },
  {
    name: "Rich Shahi Paneer",
    category: "Main Course",
    price: 340,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "Cottage cheese cubes cooked in a royal, creamy cashew-nut gravy flavored with cardamom and saffron.",
    isVeg: true,
    isAvailable: true,
    prepTime: 15,
  },
  {
    name: "Grilled Salmon Fillet",
    category: "Main Course",
    price: 590,
    image: "https://images.unsplash.com/photo-1535398089889-183cf9e6900f?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    description: "Fresh Atlantic salmon fillet grilled to perfection, served with lemon-herb butter sauce and sautéed greens.",
    isVeg: false,
    isAvailable: true,
    prepTime: 18,
  },
  {
    name: "Creamy Chicken Alfredo Pasta",
    category: "Main Course",
    price: 399,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    description: "Fettuccine pasta tossed in cream parmesan sauce, loaded with tender grilled chicken slices.",
    isVeg: false,
    isAvailable: true,
    prepTime: 14,
  },
  {
    name: "Classic Fish and Chips",
    category: "Main Course",
    price: 360,
    image: "https://images.unsplash.com/photo-1535398089889-183cf9e6900f?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    description: "Crispy golden beer-battered cod fish fillet served with sea-salt French fries and tartar sauce.",
    isVeg: false,
    isAvailable: true,
    prepTime: 15,
  },
  {
    name: "Warm Chocolate Lava Fondant",
    category: "Desserts",
    price: 240,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "Warm chocolate cake with a molten dark chocolate core, served with vanilla scoop.",
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
  },
  {
    name: "Triple Chocolate Mousse Cake",
    category: "Desserts",
    price: 260,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    description: "Layers of white, milk, and dark chocolate mousse on a spongy chocolate base.",
    isVeg: true,
    isAvailable: true,
    prepTime: 8,
  },
  {
    name: "Carrot Halwa with Pistachios",
    category: "Desserts",
    price: 160,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    description: "Traditional sweet pudding made with grated fresh red carrots, milk, ghee, cardamom, and toasted pistachios.",
    isVeg: true,
    isAvailable: true,
    prepTime: 8,
  },
  {
    name: "Sizzling Chocolate Brownie",
    category: "Desserts",
    price: 250,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    description: "A hot walnut brownie served on a sizzler plate, topped with vanilla ice cream and hot chocolate fudge.",
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
  },
  {
    name: "Chilled Strawberry Smoothie",
    category: "Beverages",
    price: 180,
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    description: "Blended fresh organic strawberries, Greek yogurt, honey, and ice cubes.",
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
  },
  {
    name: "Fresh Watermelon Cooler",
    category: "Beverages",
    price: 140,
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60",
    rating: 4.5,
    description: "Freshly pressed sweet watermelon juice finished with black salt, fresh mint leaves, and lime juice.",
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/restaurant-db";
    console.log(`Seeding DB with URI: ${mongoUri}`);

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing collections
    console.log("Clearing existing collections...");
    await User.deleteMany({});
    await Food.deleteMany({});
    await Order.deleteMany({});
    await Reservation.deleteMany({});

    // Seed Users
    console.log("Inserting users...");
    // Use loop to ensure bcrypt pre-save trigger encrypts password
    const createdUsers = [];
    for (const userData of usersData) {
      const u = await User.create(userData);
      createdUsers.push(u);
    }
    console.log(`Inserted ${usersData.length} users successfully.`);

    const customerUser = createdUsers.find(u => u.role === "Customer");

    // Seed Foods
    console.log("Inserting food items...");
    const foodsWithReviews = foodsData.map(food => {
      if (food.reviews && food.reviews.length > 0) {
        food.reviews = food.reviews.map(review => ({
          ...review,
          userId: customerUser._id
        }));
      }
      return food;
    });

    await Food.insertMany(foodsWithReviews);
    console.log(`Inserted ${foodsData.length} food items successfully.`);

    console.log("Database seeded successfully!");
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDB();
