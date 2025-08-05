import express from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import todoRoutes from "./routes/todoRoute.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin:
      "https://mern-todo-git-create-todo-feature-basawarajs-projects.vercel.app",
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
