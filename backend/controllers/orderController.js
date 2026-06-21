const Order = require("../models/Order");
const Food = require("../models/Food");

// Helper to calculate pricing details
const calculateOrderPricing = async (items, discountCode) => {
  let subtotal = 0;

  for (const item of items) {
    const food = await Food.findById(item.foodId);
    if (!food) {
      throw new Error(`Food item not found: ${item.foodId}`);
    }
    if (!food.isAvailable) {
      throw new Error(`Food item is currently unavailable: ${food.name}`);
    }
    subtotal += food.price * item.quantity;
  }

  // GST 5% on restaurant bills
  const gst = Math.round(subtotal * 0.05 * 100) / 100;

  // Delivery charge flat $3 or $45 (using INR equivalent or generic unit)
  // Let's use standard numbers like 40 INR delivery charge
  const deliveryCharge = subtotal > 500 ? 0 : 40;

  // Apply discount if valid coupon code
  let discount = 0;
  if (discountCode === "WELCOME10") {
    discount = Math.round(subtotal * 0.1 * 100) / 100; // 10% off
  } else if (discountCode === "FREE20") {
    discount = Math.round(subtotal * 0.2 * 100) / 100; // 20% off
  }

  const totalAmount = Math.max(0, subtotal + gst + deliveryCharge - discount);

  return { subtotal, gst, deliveryCharge, discount, totalAmount };
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, discountCode, address, phone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    // Calculate totals
    const pricing = await calculateOrderPricing(items, discountCode);

    // Populate order items detailed schema
    const orderItems = [];
    for (const item of items) {
      const food = await Food.findById(item.foodId);
      orderItems.push({
        foodId: food._id,
        name: food.name,
        quantity: item.quantity,
        price: food.price,
        image: food.image,
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      subtotal: pricing.subtotal,
      gst: pricing.gst,
      deliveryCharge: pricing.deliveryCharge,
      discount: pricing.discount,
      totalAmount: pricing.totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid", // Simulated payment auto-approval for card/UPI
      address,
      phone,
    });

    // Populate user info for socket payload
    const populatedOrder = await Order.findById(order._id).populate("userId", "name email phone");

    // Emit Socket.io event to alert Admins & Chefs
    const io = req.app.get("io");
    if (io) {
      io.emit("newOrder", populatedOrder);
    }

    res.status(201).json({ success: true, message: "Order placed successfully", order: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("deliveryPartner", "name phone");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Users can only see their own orders unless they are staff
    const hasAccess =
      req.user.role !== "Customer" || order.userId._id.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin/Chef/Delivery only)
// @route   GET /api/orders
// @access  Private
exports.getAllOrders = async (req, res) => {
  try {
    let query = {};

    // Delivery partners can fetch either unassigned orders or orders assigned specifically to them
    if (req.user.role === "Delivery") {
      query = {
        $or: [
          { orderStatus: "Ready", deliveryPartner: { $exists: false } },
          { deliveryPartner: req.user._id },
        ],
      };
    }

    const orders = await Order.find(query)
      .populate("userId", "name email phone")
      .populate("deliveryPartner", "name phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate("userId", "name email phone")
      .populate("deliveryPartner", "name phone");

    // Real-time status update to Customer and dashboards
    const io = req.app.get("io");
    if (io) {
      // Send to room of the specific user
      io.to(populatedOrder.userId._id.toString()).emit("orderUpdate", populatedOrder);
      // Broadcast to everybody for dashboards to update lists in real-time
      io.emit("orderStatusChange", populatedOrder);
    }

    res.json({ success: true, message: "Order updated successfully", order: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign delivery partner to order
// @route   PUT /api/orders/:id/assign
// @access  Private
exports.assignDeliveryPartner = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Set delivery partner and transition order status to OutForDelivery
    order.deliveryPartner = req.user._id;
    order.orderStatus = "OutForDelivery";

    const updatedOrder = await order.save();
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate("userId", "name email phone")
      .populate("deliveryPartner", "name phone");

    // Real-time socket broadcast
    const io = req.app.get("io");
    if (io) {
      io.to(populatedOrder.userId._id.toString()).emit("orderUpdate", populatedOrder);
      io.emit("orderStatusChange", populatedOrder);
    }

    res.json({ success: true, message: "Assigned to delivery successfully", order: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
