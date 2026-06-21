const Food = require("../models/Food");

// @desc    Get all foods with search/filtering
// @route   GET /api/foods
// @access  Public
exports.getFoods = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, isVeg, rating } = req.query;
    let query = {};

    // Search by name (case-insensitive regex)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by Veg / Non-Veg
    if (isVeg !== undefined && isVeg !== "") {
      query.isVeg = isVeg === "true";
    }

    // Filter by rating
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    const foods = await Food.find(query);
    res.json({ success: true, count: foods.length, foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single food item details
// @route   GET /api/foods/:id
// @access  Public
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }
    res.json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new food item (Admin only)
// @route   POST /api/foods
// @access  Private/Admin
exports.createFood = async (req, res) => {
  try {
    const { name, category, price, image, description, isVeg, isAvailable, prepTime } = req.body;

    const food = await Food.create({
      name,
      category,
      price,
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", // default fallback
      description: description || "",
      isVeg: isVeg !== undefined ? isVeg : true,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      prepTime: prepTime || 15,
      rating: 4.5, // initial default rating
    });

    res.status(201).json({ success: true, message: "Food item created successfully", food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update food details (Admin only)
// @route   PUT /api/foods/:id
// @access  Private/Admin
exports.updateFood = async (req, res) => {
  try {
    const { name, category, price, image, description, isVeg, isAvailable, prepTime } = req.body;

    const food = await Food.findById(req.params.id);

    if (food) {
      food.name = name || food.name;
      food.category = category || food.category;
      food.price = price !== undefined ? price : food.price;
      food.image = image || food.image;
      food.description = description !== undefined ? description : food.description;
      food.isVeg = isVeg !== undefined ? isVeg : food.isVeg;
      food.isAvailable = isAvailable !== undefined ? isAvailable : food.isAvailable;
      food.prepTime = prepTime !== undefined ? prepTime : food.prepTime;

      const updatedFood = await food.save();
      res.json({ success: true, message: "Food item updated successfully", food: updatedFood });
    } else {
      res.status(404).json({ success: false, message: "Food item not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete food item (Admin only)
// @route   DELETE /api/foods/:id
// @access  Private/Admin
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      await Food.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: "Food item deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Food item not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review to food item
// @route   POST /api/foods/:id/reviews
// @access  Private
exports.addFoodReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    // Check if user already reviewed this food
    const alreadyReviewed = food.reviews.find(
      (r) => r.userId.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "You have already reviewed this food item" });
    }

    const review = {
      userId: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    };

    food.reviews.push(review);

    // Recalculate average rating
    food.rating =
      food.reviews.reduce((acc, item) => item.rating + acc, 0) /
      food.reviews.length;

    await food.save();
    res.status(201).json({ success: true, message: "Review added successfully", food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
