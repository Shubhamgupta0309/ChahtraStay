import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import hostelRoutes from "./routes/hostelRoutes.js";
dotenv.config();
const app = express();
app.use(express.urlencoded());
const PORT = process.env.PORT;

connectDB();
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcom to chahtraStay",
  });
});
app.use("/api/auth", userRoutes);
app.use("/api/hostel", hostelRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
