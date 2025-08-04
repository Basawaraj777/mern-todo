import mongoose from "mongoose";
import app from "./index.js";

import dotenv from "dotenv";
dotenv.config();

const DB = process.env.MONGODB_URL;

mongoose
  .connect(DB)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Connection Error:", err));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
