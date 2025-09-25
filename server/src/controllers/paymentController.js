import Razorpay from "razorpay";
import config from "../config/razorpayConfig.js";
import crypto from "crypto"
const razorpay = new Razorpay({
  key_id: config.razorpay.key_id,
  key_secret: config.razorpay.key_secret,
});
const createOrder = async (req, res) => {
  console.log(req.body)
  if (!req.body.amount || !req.body.currency || !req.body.hostelId) {
    return res.status(400).json({
      message: "Some details are missing.",
    });
  }
  const generateRecipt = () => {
    const date = Date.now();
    return `ORDER_${req.body.hostelId}_${date}`.toUpperCase();
  };
  let receipt = generateRecipt();
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: req.body.currency,
      receipt: receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while creating order", error: error });
  }
};
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", config.razorpay.key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export { createOrder, verifyPayment };
