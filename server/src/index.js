import dotenv from "dotenv";
import express from "express";
dotenv.config();
const app = express();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
