import express from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/user", userRoute);

export default app;
