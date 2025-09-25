import { Router } from "express";
import {
  loginUser,
  registerUser,
  deleteUser,
  makeAdmin,
  getAllUsers,
  getUserById,
  removeAdmin,
  getProfile,
  searchUser,
  updateUser,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to user routes",
  });
});

// Google OAuth route removed

router.post("/signup", registerUser);
router.post("/login", loginUser);

router.get("/all", protect, adminOnly, getAllUsers);
router.get("/search", protect, adminOnly, searchUser);
router.get("/profile", protect, getProfile);

router.get("/:id", protect, getUserById);

router.patch("/make-admin/:id", protect, adminOnly, makeAdmin);
router.patch("/remove-admin/:id", protect, adminOnly, removeAdmin);
router.patch("/update", protect, updateUser);

router.delete("/:id", protect,adminOnly, deleteUser);

export default router;
