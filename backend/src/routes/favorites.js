const express = require("express");
const User = require("../models/User");
const Content = require("../models/Content");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.use(authRequired);

router.get("/", async (req, res) => {
  const user = await User.findById(req.userId).populate("favorites");
  res.json({ items: user?.favorites ?? [] });
});

router.post("/:contentId", async (req, res) => {
  const content = await Content.findById(req.params.contentId);
  if (!content) return res.status(404).json({ message: "Konten tidak ditemukan" });
  const user = await User.findById(req.userId);
  const id = content._id.toString();
  const already = user.favorites.some((f) => f.toString() === id);
  if (!already) {
    user.favorites.push(content._id);
    await user.save();
  }
  await user.populate("favorites");
  res.json({ items: user.favorites, saved: true });
});

router.delete("/:contentId", async (req, res) => {
  const user = await User.findById(req.userId);
  user.favorites = user.favorites.filter((f) => f.toString() !== req.params.contentId);
  await user.save();
  await user.populate("favorites");
  res.json({ items: user.favorites, saved: false });
});

module.exports = router;
