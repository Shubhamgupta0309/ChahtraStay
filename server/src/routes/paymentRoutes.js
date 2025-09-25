import Router from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

const router = Router();
router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to Payment Route",
  });
});
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
export default router;
