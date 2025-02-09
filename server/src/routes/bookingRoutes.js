import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  cancelBooking,
  confirmBooking,
  generateReceipt,
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);

router.get("/", protect, adminOnly, getAllBookings);

router.get("/my-bookings", protect, getUserBookings);

router.get("/:id", protect, getBookingById);

router.put("/:id/cancel", protect, cancelBooking);

router.put("/:id/confirm", protect, adminOnly, confirmBooking);

router.get("/:id/receipt", protect, generateReceipt);

export default router;
