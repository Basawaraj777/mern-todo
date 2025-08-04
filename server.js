const mongoose = require("mongoose");
const app = require("./index.js");
const dotenv = require("dotenv");
dotenv.config();

const DB = process.env.MONGODB_URL;

mongoose
  .connect(DB)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Connection Error:", err));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
