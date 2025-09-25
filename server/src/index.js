import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import hostelRoutes from "./routes/hostelRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors";
import { sendNotification } from "./discordBot/NotificationBot.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
const PORT = process.env.PORT;

connectDB();
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcom to TravelTribe",
  });
});
app.use("/api/user", userRoutes);
app.use("/api/hostel", hostelRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);

//for discord bot notification
app.post("/api/support", async (req, res) => {
  const { name, email, topic, message } = req.body;
  await sendNotification("support", {
    name,
    email,
    topic,
    message,
  });
  res.status(200).json({
    message: "Support request received",
  });
});
app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;
  await sendNotification("subscribe", {
    email,
  });
  res.status(200).json({
    message: "Subscription request received",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
