import express from "express";
import {
  createHostel,
  getAllHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
} from "../controllers/hostelController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly,upload.array("images"), createHostel);
router.get("/", getAllHostels);
router.get("/:id", getHostelById);
router.patch("/:id", protect, adminOnly,upload.array("images"), updateHostel);
router.delete("/:id", protect, adminOnly, deleteHostel);

export default router;
