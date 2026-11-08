const jwt = require("jsonwebtoken");
const User = require("../models/User");

function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Autentikasi diperlukan" });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa" });
  }
}

async function attachUserIfToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.user = await User.findById(payload.sub).select("-password");
  } catch {
    /* tamu */
  }
  next();
}

module.exports = { authRequired, attachUserIfToken };
