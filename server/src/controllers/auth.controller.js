import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

function signToken(userId) {
  const secret = process.env.JWT_SECRET || process.env.JWTKey || "default_jwt_secret_dev";
  return jwt.sign({ id: userId }, secret, { expiresIn: "30d" });
}

export async function signup(req, res) {
  try {
    const { name, email, password, img } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const trimmedName = name.trim();
    const cleanEmail = email.toLowerCase().trim();

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const existing = User.findByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = User.create({
      name: trimmedName,
      email: cleanEmail,
      password: hash,
      img: img || null,
    });

    const token = signToken(user._id);
    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        img: user.img,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: err.message || "Internal server error during signup" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = User.findByEmail(cleanEmail);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        img: user.img,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: err.message || "Internal server error during login" });
  }
}

export async function me(req, res) {
  try {
    const userId = req.user?.id || req.userId;
    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ message: "Failed to retrieve user profile" });
  }
}
