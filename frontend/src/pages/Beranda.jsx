import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GuestBanner from "../components/GuestBanner";
import ContentCard from "../components/ContentCard";
import { contentApi } from "../api/client";
import "./Pages.css";

const shortcuts = [
  { label: "Artikel", cat: "artikel", icon: "📄" },
  { label: "Video", cat: "video", icon: "▶" },
  { label: "Olahraga", cat: "olahraga", icon: "🏃" },
  { label: "Nutrisi", cat: "nutrisi", icon: "🥗" },
];

export default function Beranda() {
  const [editorPick, setEditorPick] = useState(null);
  const [light, setLight] = useState([]);

  useEffect(() => {
    contentApi.list({ editorPick: "true" }).then((r) => setEditorPick(r.items[0]));
    contentApi.list({ category: "olahraga" }).then((r) => setLight(r.items.slice(0, 3)));
  }, []);

  return (
    <main className="page">
      <section className="hero-banner">
        <div>
          <p className="greeting-label">SELAMAT PAGI, TEMAN SEHAT</p>
          <h1 className="page-hero-title">Sehat dimulai dari hal kecil.</h1>
          <p className="page-sub">Artikel, video, dan panduan untuk kebiasaan hidup lebih baik.</p>
        </div>
        <GuestBanner />
      </section>
      <div className="shortcut-grid">
        {shortcuts.map((s) => (
          <Link key={s.cat} to={`/jelajah?category=${s.cat}`} className="shortcut">
            <span>{s.icon}</span>
            {s.label}
          </Link>
        ))}
      </div>
      <h2 className="section-title">Pilihan hari ini</h2>
      {editorPick && (
        <motion className="featured-row">
          <ContentCard item={editorPick} featured showSave={false} />
        </motion>
      )}
      <h2 className="section-title">Mulai dari yang ringan</h2>
      <motion className="card-grid">
        {light.map((item) => (
          <ContentCard key={item._id} item={item} />
        ))}
      </motion>
    </main>
  );
}

function motion({ className, children }) {
  return <div className={className}>{children}</div>;
}
