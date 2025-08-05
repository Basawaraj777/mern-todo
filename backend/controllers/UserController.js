import { createSendToken } from "../lib/JWT.js";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    //Checking if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email: req.body.email,
      password,
      confirmPassword,
    });

    createSendToken(newUser, 201, req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return res
      .status(400)
      .status({ message: "Please provide email and password!" });
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
};

export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ message: "Please log in to get access." });
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      message: "The user belonging to this token does no longer exist.",
    });
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

export const getProfile = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Token missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
};
