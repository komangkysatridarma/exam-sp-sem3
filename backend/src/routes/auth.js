const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Lengkapi semua field" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Kata sandi minimal 8 karakter" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Konfirmasi kata sandi tidak cocok" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }
    const user = await User.create({ fullName: fullName.trim(), email, password });
    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email dan kata sandi wajib diisi" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Email atau kata sandi salah" });
    }
    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", authRequired, async (req, res) => {
  const user = await User.findById(req.userId).select("-password").populate("favorites");
  if (!user) return res.status(404).json({ message: "Pengguna tidak ditemukan" });
  res.json({ user });
});

module.exports = router;
