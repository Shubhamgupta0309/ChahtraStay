import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

// connect when running as a normal server
if (process.env.VERCEL !== "1") {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
