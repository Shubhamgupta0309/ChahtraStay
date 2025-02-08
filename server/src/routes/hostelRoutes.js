import express from "express";
import {
  createHostel,
  getAllHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
} from "../controllers/hostelController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createHostel);
router.get("/", getAllHostels);
router.get("/:id", getHostelById);
router.put("/:id", protect, adminOnly, updateHostel);
router.delete("/:id", protect, adminOnly, deleteHostel);

export default router;
