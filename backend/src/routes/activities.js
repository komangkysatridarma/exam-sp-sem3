const express = require("express");
const Activity = require("../models/Activity");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

const typeLabels = {
  jalan_kaki: "Jalan kaki",
  peregangan: "Peregangan",
  lari: "Lari",
  bersepeda: "Bersepeda",
  lainnya: "Lainnya",
};

router.get("/preview/weekly", (_req, res) => {
  res.json({
    totalMinutes: 115,
    days: [
      { label: "S", minutes: 0 },
      { label: "S", minutes: 20 },
      { label: "R", minutes: 15 },
      { label: "K", minutes: 30 },
      { label: "J", minutes: 25 },
      { label: "S", minutes: 25 },
      { label: "M", minutes: 0 },
    ],
    sampleHistory: [
      {
        date: "Hari ini - 8 November",
        items: [
          {
            typeLabel: "Jalan kaki",
            timeLabel: "Pagi • ringan",
            durationMinutes: 20,
            icon: "walk",
          },
        ],
      },
      {
        date: "Kemarin - 7 November",
        items: [
          {
            typeLabel: "Peregangan",
            timeLabel: "Malam • ringan",
            durationMinutes: 15,
            icon: "stretch",
          },
        ],
      },
    ],
  });
});

router.use(authRequired);

function startOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

router.get("/weekly", async (req, res) => {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const activities = await Activity.find({
    user: req.userId,
    date: { $gte: weekStart, $lt: weekEnd },
  });
  const days = ["M", "S", "S", "R", "K", "J", "S"];
  const minutesByDay = [0, 0, 0, 0, 0, 0, 0];
  let totalMinutes = 0;
  for (const a of activities) {
    const dow = new Date(a.date).getDay();
    const idx = dow === 0 ? 6 : dow - 1;
    minutesByDay[idx] += a.durationMinutes;
    totalMinutes += a.durationMinutes;
  }
  const chart = days.map((label, i) => ({ label, minutes: minutesByDay[i] }));
  res.json({ totalMinutes, days: chart });
});

router.get("/", async (req, res) => {
  const activities = await Activity.find({ user: req.userId }).sort({ date: -1 }).limit(50);
  res.json({ items: activities });
});

router.post("/", async (req, res) => {
  const { type, date, durationMinutes, notes, intensity } = req.body;
  if (!type || !date || !durationMinutes) {
    return res.status(400).json({ message: "Jenis aktivitas, tanggal, dan durasi wajib" });
  }
  const typeLabel = typeLabels[type] || type;
  const activity = await Activity.create({
    user: req.userId,
    type,
    typeLabel,
    date: new Date(date),
    durationMinutes: Number(durationMinutes),
    intensity: intensity || "ringan",
    notes: notes || "",
  });
  res.status(201).json({ item: activity });
});

module.exports = router;
