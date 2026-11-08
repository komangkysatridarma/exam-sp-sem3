require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/auth");
const contentRoutes = require("./routes/content");
const favoritesRoutes = require("./routes/favorites");
const activitiesRoutes = require("./routes/activities");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "HealthyLife API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/activities", activitiesRoutes);

async function main() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthylife";
  await connectDB(uri);
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
