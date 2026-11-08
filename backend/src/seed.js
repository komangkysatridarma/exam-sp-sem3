require("dotenv").config();
const mongoose = require("mongoose");
const Content = require("./models/Content");
const { connectDB } = require("./config/db");

const seedItems = [
  {
    title: "Isi piringmu, seimbangkan harimu",
    slug: "isi-piringmu-seimbangkan-harimu",
    category: "nutrisi",
    type: "article",
    excerpt: "Keseimbangan piring membantu tubuh mendapat nutrisi yang cukup tanpa menu rumit.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    readMinutes: 5,
    featured: true,
    editorPick: true,
    rememberBox:
      "Setengah piring sayur dan buah, seperempat karbohidrat, seperempat protein — cukup untuk satu kali makan.",
    body: `Kenali isi piringmu

Isi piring sehat lazimnya dibagi tiga: setengah sayur dan buah, seperempat makanan pokok, seperempat protein.

1/2 Sayur & buah — sumber serat dan vitamin.

1/4 Makanan pokok — nasi, kentang, atau kacang-kacangan sebagai energi.

1/4 Sumber protein — telur, ikan, tahu, atau ayam untuk pemulihan otot.

Coba di waktu makan berikutnya

Tambahkan satu porsi sayur lebih banyak dari biasanya, lalu amati apakah kamu merasa kenyang lebih lama.`,
    references: ["Kementerian Kesehatan RI – Pedoman Gizi Seimbang"],
    author: "Tim Editorial HealthyLife",
    publishedAt: new Date("2026-11-08"),
  },
  {
    title: "Tidur lebih teratur, badan lebih segar",
    slug: "tidur-lebih-teratur",
    category: "istirahat",
    type: "article",
    excerpt: "Rutinitas tidur yang konsisten membantu tubuh pulih lebih baik.",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2d05765?w=800&q=80",
    readMinutes: 4,
    featured: true,
  },
  {
    title: "Peregangan ringan di sela kesibukan",
    slug: "peregangan-ringan",
    category: "video",
    type: "video",
    excerpt: "Video singkat untuk melegakan otot saat duduk lama.",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    readMinutes: 6,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    durationLabel: "5–6 menit",
    featured: true,
  },
  {
    title: "Jalan kaki 20 menit, mulai dari mana?",
    slug: "jalan-kaki-20-menit",
    category: "olahraga",
    type: "guide",
    excerpt: "Panduan praktis untuk memulai kebiasaan berjalan kaki singkat.",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8ecc8?w=800&q=80",
    readMinutes: 3,
    durationLabel: "20 menit",
    featured: true,
    body: "Mulai dari rute dekat rumah, kenakan alas kaki nyaman, dan lakukan pemanasan 2 menit sebelum berjalan.",
  },
  {
    title: "Kenali serat dalam menu harianmu",
    slug: "kenali-serat-menu-harian",
    category: "nutrisi",
    type: "article",
    excerpt: "Serat membantu pencernaan dan menahan lapar lebih lama.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    readMinutes: 4,
    featured: true,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthylife";
  await connectDB(uri);
  await Content.deleteMany({});
  await Content.insertMany(seedItems);
  console.log(`Seed: ${seedItems.length} konten`);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
