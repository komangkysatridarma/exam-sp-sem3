const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["artikel", "video", "olahraga", "nutrisi", "istirahat"],
      required: true,
    },
    type: { type: String, enum: ["article", "video", "guide"], default: "article" },
    excerpt: String,
    body: String,
    imageUrl: String,
    readMinutes: { type: Number, default: 5 },
    videoUrl: String,
    durationLabel: String,
    author: { type: String, default: "Tim Editorial HealthyLife" },
    publishedAt: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false },
    editorPick: { type: Boolean, default: false },
    rememberBox: String,
    references: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
