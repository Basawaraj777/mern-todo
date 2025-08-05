import express from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import todoRoutes from "./routes/todoRoute.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      "https://mern-todo-45l20k4tr-basawarajs-projects.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/todo", todoRoutes);

export default app;
