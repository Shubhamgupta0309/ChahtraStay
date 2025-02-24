import express from "express";
import Booking from "../model/BookingModel.js"

const router = express.Router();

export const createBooking = async (req, res) => {
  try {
    const { checkIn, hostelId, checkOut, roomSelection, name, email, phone, gender, occupation, amount, transactionId } = req.body;

    if (!checkIn || !hostelId || !checkOut || !roomSelection || !amount || !name || !email || !phone || !gender || !occupation || !transactionId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newBooking = new Booking({
      user: req.user._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      roomSelection,
      hostelId,
      amount,
      name,
      email,
      phone,
      gender,
      occupation,
      transactionId,
      status: "pending"
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const bookings = await Booking.find({ user: req.user._id });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    console.log(req.user.role)

    if (booking.user.toString() !== req.user._id.toString() && req.user.role != "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    booking.status = "confirmed";
    await booking.save();
    res.status(200).json({ message: "Booking confirmed", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateReceipt = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "confirmed") {
      return res.status(400).json({ message: "Booking is not confirmed yet" });
    }

    res.status(200).json({
      message: "Receipt Generated Successfully",
      receipt: {
        bookingId: booking._id,
        user: booking.name,
        email: booking.email,
        phone: booking.phone,
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
        roomSelection: booking.roomSelection,
        totalAmount: booking.amount,
        transactionId: booking.transactionId,
        status: booking.status,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default router;
