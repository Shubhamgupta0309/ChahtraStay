import serverless from "serverless-http";
import dotenv from "dotenv";
import connectDB from "../src/config/db.js";
import app from "../src/app.js";

dotenv.config();

// For serverless we want to reuse DB connection across invocations.
let isConnected = false;
const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

const handler = async (req, res) => {
  await ensureDB();
  return app(req, res);
};

export const defaultHandler = serverless(app);
