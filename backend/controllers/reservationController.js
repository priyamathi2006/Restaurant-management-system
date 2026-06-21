const Reservation = require("../models/Reservation");

// @desc    Create new table reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, reservationDate, guests, tableNumber, specialRequests } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !reservationDate || !guests || !tableNumber) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    // Check if table is already booked for the exact date and hour slot
    const start = new Date(reservationDate);
    start.setMinutes(0, 0, 0); // round to start of hour
    const end = new Date(start);
    end.setHours(start.getHours() + 2); // 2 hours slot

    const overlappingReservation = await Reservation.findOne({
      tableNumber,
      status: "Confirmed",
      reservationDate: {
        $gte: start,
        $lt: end,
      },
    });

    if (overlappingReservation) {
      return res.status(400).json({
        success: false,
        message: `Table #${tableNumber} is already reserved around this time slot. Please choose another table or time.`,
      });
    }

    const reservation = await Reservation.create({
      userId: req.user._id,
      customerName,
      customerEmail,
      customerPhone,
      reservationDate: new Date(reservationDate),
      guests,
      tableNumber,
      specialRequests: specialRequests || "",
      status: "Pending", // Default is pending confirmation by Admin
    });

    res.status(201).json({ success: true, message: "Reservation request submitted successfully", reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user reservations
// @route   GET /api/reservations/myreservations
// @access  Private
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id }).sort({ reservationDate: -1 });
    res.json({ success: true, reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reservations (Admin only)
// @route   GET /api/reservations
// @access  Private
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({})
      .populate("userId", "name email phone")
      .sort({ reservationDate: -1 });
    res.json({ success: true, reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update reservation status (Admin only)
// @route   PUT /api/reservations/:id/status
// @access  Private
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }

    reservation.status = status || reservation.status;
    const updatedReservation = await reservation.save();

    res.json({ success: true, message: "Reservation status updated successfully", reservation: updatedReservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
