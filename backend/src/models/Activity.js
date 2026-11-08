const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["jalan_kaki", "peregangan", "lari", "bersepeda", "lainnya"],
      required: true,
    },
    typeLabel: { type: String, required: true },
    date: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    intensity: {
      type: String,
      enum: ["ringan", "sedang", "berat"],
      default: "ringan",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Activity", activitySchema);
