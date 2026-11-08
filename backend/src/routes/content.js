const express = require("express");
const Content = require("../models/Content");

const router = express.Router();

const categoryMap = {
  semua: null,
  artikel: "artikel",
  video: "video",
  olahraga: "olahraga",
  nutrisi: "nutrisi",
};

router.get("/", async (req, res) => {
  try {
    const { category, q, featured, editorPick, type } = req.query;
    const filter = {};
    const cat = categoryMap[category] ?? category;
    if (cat && cat !== "semua") filter.category = cat;
    if (type) filter.type = type;
    if (featured === "true") filter.featured = true;
    if (editorPick === "true") filter.editorPick = true;
    if (q?.trim()) {
      filter.$or = [
        { title: { $regex: q.trim(), $options: "i" } },
        { excerpt: { $regex: q.trim(), $options: "i" } },
      ];
    }
    const items = await Content.find(filter).sort({ publishedAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/slug/:slug", async (req, res) => {
  const item = await Content.findOne({ slug: req.params.slug });
  if (!item) return res.status(404).json({ message: "Konten tidak ditemukan" });
  res.json({ item });
});

router.get("/:id", async (req, res) => {
  const item = await Content.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Konten tidak ditemukan" });
  res.json({ item });
});

module.exports = router;
